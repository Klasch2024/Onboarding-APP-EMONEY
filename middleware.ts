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

  // Allow root path to be handled by the page logic
  if (pathname === '/') {
    return NextResponse.next();
  }

  try {
    // Verify user token and get user ID
    const userToken = request.headers.get('authorization')?.replace('Bearer ', '') ||
                     request.cookies.get('whop-token')?.value;
    
    if (!userToken) {
      // No token - redirect to onboarding discover page
      if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/onboarding/discover', request.url));
      }
      return NextResponse.next();
    }

    // Verify the user token
    const verification = await whopSdk.verifyUserToken(request.headers);

    if (!verification || !verification.userId) {
      // Invalid token - redirect to onboarding discover page
      if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/onboarding/discover', request.url));
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
        return NextResponse.redirect(new URL('/onboarding/discover', request.url));
      }

      try {
        const accessCheck = await whopSdk.access.checkIfUserHasAccessToCompany({
          userId,
          companyId
        });

        // Only allow users with admin access
        if (accessCheck.accessLevel !== 'admin') {
          return NextResponse.redirect(new URL('/onboarding/discover', request.url));
        }
      } catch (error) {
        console.error('Error checking company access:', error);
        return NextResponse.redirect(new URL('/onboarding/discover', request.url));
      }
    }

    // Check if user is trying to access onboarding experience routes
    if (pathname.startsWith('/onboarding/experiences/')) {
      const experienceId = pathname.split('/')[3]; // Extract experience ID from URL
      
      if (experienceId) {
        try {
          const accessCheck = await whopSdk.access.checkIfUserHasAccessToExperience({
            userId,
            experienceId
          });

          // Redirect if user doesn't have access to this experience
          if (accessCheck.accessLevel === 'no_access') {
            return NextResponse.redirect(new URL('/onboarding/discover', request.url));
          }
        } catch (error) {
          console.error('Error checking experience access:', error);
          return NextResponse.redirect(new URL('/onboarding/discover', request.url));
        }
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    
    // On error, redirect admin users to onboarding discover page
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/onboarding/discover', request.url));
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
