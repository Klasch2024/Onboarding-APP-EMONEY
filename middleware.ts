import { NextRequest, NextResponse } from 'next/server';
import { checkUserPermissions } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Admin-only routes that require authentication
  const adminRoutes = ['/builder', '/dashboard'];
  
  // Check if accessing admin routes
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    // Extract user ID and company ID from request headers
    // These should be set by Whop when the user accesses the app
    const userId = request.headers.get('x-whop-user-id') || 
                   request.headers.get('x-user-id');
    const companyId = request.headers.get('x-whop-company-id') || 
                      request.headers.get('x-company-id');
    
    // If no user/company info, redirect to unauthorized
    if (!userId || !companyId) {
      console.log('No user/company ID found in headers');
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    
    try {
      // Check user permissions
      const permissions = await checkUserPermissions(userId, companyId);
      
      if (!permissions.isAdmin) {
        console.log('User does not have admin permissions');
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
      
      // Add user info to headers for the page to use
      const response = NextResponse.next();
      response.headers.set('x-user-id', userId);
      response.headers.set('x-company-id', companyId);
      response.headers.set('x-is-admin', 'true');
      
      return response;
    } catch (error) {
      console.error('Permission check failed in middleware:', error);
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/builder/:path*', 
    '/dashboard/:path*'
  ]
};
