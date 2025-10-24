import { NextRequest, NextResponse } from 'next/server';
import { checkUserPermissions, checkAdminAccess, checkUserAccessToExperience } from './lib/auth';

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
    console.log('Middleware: Checking permissions for', pathname);
    
    // Check user permissions
    const permissions = await checkUserPermissions(userId, companyId);
    
    console.log('Middleware: User permissions result:', {
      isAdmin: permissions.isAdmin,
      isMember: permissions.isMember,
      accessLevel: permissions.accessLevel
    });
    
    // Check if accessing admin routes (dashboard, builder, admin)
    if (adminRoutes.some(route => pathname.startsWith(route))) {
      console.log('Middleware: Accessing admin route:', pathname);
      
      // Use specific admin access check for dashboard routes
      if (pathname.startsWith('/dashboard/')) {
        const hasAdminAccess = await checkAdminAccess(userId, companyId);
        if (!hasAdminAccess) {
          console.log('Middleware: User does not have admin access for dashboard, redirecting to onboarding');
          return NextResponse.redirect(new URL('/experiences/default', request.url));
        }
      } else if (!permissions.isAdmin) {
        console.log('Middleware: User does not have admin permissions, redirecting to user dashboard');
        return NextResponse.redirect(new URL('/experiences/default', request.url));
      }
      
      console.log('Middleware: Admin access granted');
      // Add admin info to headers
      const response = NextResponse.next();
      response.headers.set('x-user-id', userId);
      response.headers.set('x-company-id', companyId);
      response.headers.set('x-is-admin', 'true');
      response.headers.set('x-access-level', permissions.accessLevel || '');
      
      return response;
    }
    
    // Check if accessing user routes (experiences)
    if (userRoutes.some(route => pathname.startsWith(route))) {
      console.log('Middleware: Accessing user route:', pathname);
      
      // Use specific user access check for experience routes
      if (pathname.startsWith('/experiences/')) {
        // Extract experienceId from pathname
        const pathParts = pathname.split('/');
        const experienceId = pathParts[2]; // /experiences/[experienceId]
        
        if (experienceId) {
          const access = await checkUserAccessToExperience(userId, experienceId);
          
          if (access.accessLevel === "admin") {
            console.log('Middleware: Admin user accessing experience, redirecting to dashboard');
            return NextResponse.redirect(new URL('/dashboard/default', request.url));
          } else if (access.accessLevel === "customer" && access.hasAccess === true) {
            console.log('Middleware: Customer user with access, allowing experience access');
            // Customer users with access can proceed to experience page
          } else {
            console.log('Middleware: User does not have access to experience');
            return NextResponse.redirect(new URL('/unauthorized', request.url));
          }
        }
      } else if (!permissions.isMember) {
        console.log('Middleware: User does not have member access');
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
      
      console.log('Middleware: User access granted');
      // Add user info to headers
      const response = NextResponse.next();
      response.headers.set('x-user-id', userId);
      response.headers.set('x-company-id', companyId);
      response.headers.set('x-is-admin', permissions.isAdmin ? 'true' : 'false');
      response.headers.set('x-access-level', permissions.accessLevel || '');
      
      return response;
    }
    
    console.log('Middleware: No specific route protection needed');
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware: Permission check failed:', error);
    
    // Fallback: Allow access to prevent complete lockout
    console.log('Middleware: Falling back to allow access due to error');
    const response = NextResponse.next();
    response.headers.set('x-user-id', userId);
    response.headers.set('x-company-id', companyId);
    response.headers.set('x-is-admin', 'true'); // Assume admin on error
    response.headers.set('x-access-level', 'admin');
    
    return response;
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
