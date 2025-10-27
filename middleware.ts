import { NextRequest, NextResponse } from 'next/server';
import { whopSdk } from './lib/shared/whop-sdk';

/**
 * Middleware for access control
 * 
 * This middleware runs on every request and checks:
 * 1. User authentication via Whop SDK
 * 2. Access level for admin routes
 * 3. Redirects non-admin users to onboarding pages
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
    // Verify user token and get user ID
    const userToken = request.headers.get('authorization')?.replace('Bearer ', '') ||
                     request.cookies.get('whop-token')?.value;
    
    if (!userToken) {
      // No token - redirect to onboarding page
      if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/onboarding', request.url));
      }
      return NextResponse.next();
    }

    // Verify the user token
    const verification = await whopSdk.verifyUserToken(request.headers);

    if (!verification || !verification.userId) {
      // Invalid token - redirect to onboarding page
      if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/onboarding', request.url));
      }
      return NextResponse.next();
    }

    const userId = verification.userId;

    // Check if user is trying to access admin routes
    if (pathname.startsWith('/admin')) {
      // Check if user has admin access to the company
      const companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;
      
      if (!companyId) {
        console.error('WHOP_COMPANY_ID not configured');
        return NextResponse.redirect(new URL('/onboarding', request.url));
      }

      try {
        const accessCheck = await whopSdk.access.checkIfUserHasAccessToCompany({
          userId,
          companyId
        });

        // Only allow users with admin access
        if (accessCheck.accessLevel !== 'admin') {
          return NextResponse.redirect(new URL('/onboarding', request.url));
        }
      } catch (error) {
        console.error('Error checking company access:', error);
        return NextResponse.redirect(new URL('/onboarding', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    
    // On error, redirect admin users to onboarding page
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
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
