import { NextRequest, NextResponse } from 'next/server';
import { checkUserPermissions } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Admin-only routes that require admin access
  const adminRoutes = ['/builder', '/admin'];
  
  // User routes that require member access
  const userRoutes = ['/experiences', '/dashboard'];
  
  // Extract user ID and company ID from request headers
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
    
    // Check if accessing admin routes
    if (adminRoutes.some(route => pathname.startsWith(route))) {
      if (!permissions.isAdmin) {
        console.log('User does not have admin permissions, redirecting to user dashboard');
        return NextResponse.redirect(new URL('/experiences/default', request.url));
      }
      
      // Add admin info to headers
      const response = NextResponse.next();
      response.headers.set('x-user-id', userId);
      response.headers.set('x-company-id', companyId);
      response.headers.set('x-is-admin', 'true');
      response.headers.set('x-access-level', permissions.accessLevel || '');
      
      return response;
    }
    
    // Check if accessing user routes
    if (userRoutes.some(route => pathname.startsWith(route))) {
      if (!permissions.isMember) {
        console.log('User does not have member access');
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
      
      // Add user info to headers
      const response = NextResponse.next();
      response.headers.set('x-user-id', userId);
      response.headers.set('x-company-id', companyId);
      response.headers.set('x-is-admin', permissions.isAdmin ? 'true' : 'false');
      response.headers.set('x-access-level', permissions.accessLevel || '');
      
      return response;
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error('Permission check failed in middleware:', error);
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
}

export const config = {
  matcher: [
    '/builder/:path*', 
    '/admin/:path*',
    '/dashboard/:path*',
    '/experiences/:path*'
  ]
};
