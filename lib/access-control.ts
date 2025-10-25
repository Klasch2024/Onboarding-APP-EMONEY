import { headers, cookies } from 'next/headers';
import { whopSdk } from './whop-sdk';

export interface AccessResult {
  hasAccess: boolean;
  accessLevel: 'admin' | 'no_access';
  userId?: string;
  error?: string;
}

/**
 * Check if user has admin access to a company
 * This function performs server-side access control using the Whop SDK
 */
export async function checkUserAccess(companyId: string): Promise<AccessResult> {
  try {
    // For development/testing: allow bypass if no token is provided
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Bypassing token check');
      return {
        hasAccess: true,
        accessLevel: 'admin',
        userId: 'dev-user'
      };
    }

    // For production, try to get user token from multiple sources
    let userToken: string | null = null;
    
    try {
      const headersList = await headers();
      const cookieStore = await cookies();
      
      // 1. Try authorization header
      userToken = headersList.get('authorization')?.replace('Bearer ', '') || null;
      
      // 2. Try other header formats
      if (!userToken) {
        userToken = headersList.get('x-user-token') || 
                    headersList.get('x-whop-token') ||
                    headersList.get('user-token') ||
                    null;
      }
      
      // 3. Try cookies (Whop often uses cookies)
      if (!userToken) {
        userToken = cookieStore.get('whop-token')?.value ||
                    cookieStore.get('user-token')?.value ||
                    cookieStore.get('access-token')?.value ||
                    null;
      }
      
      // Debug logging
      console.log('Headers received:', Object.fromEntries(headersList.entries()));
      console.log('Cookies received:', Object.fromEntries(cookieStore.getAll().map(c => [c.name, c.value])));
      console.log('Extracted token:', userToken ? 'Token found' : 'No token');
      
    } catch (headerError) {
      console.error('Error accessing headers/cookies:', headerError);
      // Continue without token
    }
    
    if (!userToken) {
      return {
        hasAccess: false,
        accessLevel: 'no_access',
        error: 'No user token provided - check if app is properly integrated with Whop'
      };
    }

    // Verify user token and get user ID
    const { userId } = await whopSdk.verifyUserToken(userToken);
    
    if (!userId) {
      return {
        hasAccess: false,
        accessLevel: 'no_access',
        error: 'Invalid user token'
      };
    }

    // Check if user has access to the company
    const access = await whopSdk.access.checkIfUserHasAccessToCompany({
      companyId,
      userId,
    });

    return {
      hasAccess: access.hasAccess,
      accessLevel: access.accessLevel as 'admin' | 'no_access',
      userId
    };
  } catch (error) {
    console.error('Access check failed:', error);
    return {
      hasAccess: false,
      accessLevel: 'no_access',
      error: 'Access check failed'
    };
  }
}

/**
 * Client-side access check hook
 * This should be used in client components to check access level
 */
export function useAccessLevel() {
  // This would typically come from a context or store
  // For now, we'll implement this in the components that need it
  return {
    isAdmin: false, // This will be set by the server-side check
    hasAccess: false
  };
}
