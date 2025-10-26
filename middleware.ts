import { NextRequest, NextResponse } from 'next/server';
import { whopSdk } from './lib/whop-sdk';

/**
 * Middleware for Whop App Authentication
 * 
 * This middleware handles:
 * - User authentication verification
 * - Token validation
 * - Setting user context for the app
 */
export async function middleware(request: NextRequest) {
  // Skip middleware for static files and API routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  try {
    // Get authorization header
    const authorization = request.headers.get('authorization');
    
    if (!authorization) {
      // No authorization header, redirect to onboarding (fallback)
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    // Extract token from Authorization header
    const token = authorization.replace('Bearer ', '');
    
    // Verify the token with Whop SDK
    const user = await whopSdk.users.retrieve(token);
    
    if (!user) {
      // Invalid token, redirect to onboarding (fallback)
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    // Token is valid, continue with the request
    return NextResponse.next();
    
  } catch (error) {
    console.error('Middleware authentication error:', error);
    // On error, redirect to onboarding (fallback)
    return NextResponse.redirect(new URL('/onboarding', request.url));
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
