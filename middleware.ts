import { NextRequest, NextResponse } from 'next/server';
import { whopSdk } from './lib/shared/whop-sdk';

/**
 * Middleware for access control
 * 
 * This middleware runs on every request and checks:
 * 1. User authentication via Whop SDK
 * 2. Access level for admin routes
 * 3. Redirects non-admin users appropriately
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes, static files, and public assets
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  try {
    // Get token from headers or cookies
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('whop-token')?.value;
    const token = authHeader?.replace('Bearer ', '') || cookieToken;
    
    if (!token) {
      // No token - allow access to root but redirect admin routes
      if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/', request.url));
      }
      return NextResponse.next();
    }

    // Verify the user token - using same pattern as example
    const { userId } = await whopSdk.verifyUserToken(request.headers);

    if (!userId) {
      // Invalid token - redirect admin routes to root
      if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/', request.url));
      }
      return NextResponse.next();
    }

            // Check if user is trying to access admin routes
            if (pathname.startsWith('/admin')) {
              // Check if user has admin access to the company
              const companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;
              
              if (!companyId) {
                console.error('WHOP_COMPANY_ID not configured');
                return NextResponse.redirect(new URL('/', request.url));
              }

              try {
                // Use the new SDK pattern with withUser() and withCompany()
                const accessCheck = await whopSdk
                  .withUser(userId)
                  .withCompany(companyId)
                  .access.checkIfUserHasAccessToCompany({
                    userId,
                    companyId
                  });

                // Only allow users with admin access
                if (accessCheck.accessLevel !== 'admin') {
                  return NextResponse.redirect(new URL('/', request.url));
                }
              } catch (error) {
                console.error('Error checking company access:', error);
                return NextResponse.redirect(new URL('/', request.url));
              }
            }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    
    // On error, redirect admin users to root
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
