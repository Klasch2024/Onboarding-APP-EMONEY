import { NextRequest, NextResponse } from 'next/server';

/**
 * Simplified middleware - only protect admin routes
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes, static files, and public assets
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.') ||
    pathname === '/' ||
    pathname.startsWith('/onboarding/')
  ) {
    return NextResponse.next();
  }

  // Only protect admin routes
  if (pathname.startsWith('/admin')) {
    // For now, allow access to admin routes
    // You can add proper authentication here later
    return NextResponse.next();
  }

  return NextResponse.next();
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
