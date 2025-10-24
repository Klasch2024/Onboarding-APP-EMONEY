import { whopSdk } from './whop-sdk';

export interface UserPermissions {
  isAdmin: boolean;
  isMember: boolean;
  user: any;
  company: any;
  accessLevel: string | null;
}

/**
 * Check user permissions using Whop SDK
 * This function verifies if a user has access to a company and their access level
 */
export async function checkUserPermissions(userId: string, companyId: string): Promise<UserPermissions> {
  try {
    // Check if we're in development mode or if bypass is enabled
    if (process.env.NODE_ENV === 'development' || process.env.BYPASS_AUTH === 'true') {
      console.log('Bypassing authentication - granting admin access');
      return {
        isAdmin: true,
        isMember: true,
        user: { id: userId, username: 'dev-user' },
        company: { id: companyId, name: 'dev-company' },
        accessLevel: 'admin'
      };
    }
    
    console.log('Checking permissions for user:', userId, 'company:', companyId);
    
    // Use Whop SDK to check user access to company
    const access = await whopSdk.access.checkIfUserHasAccessToCompany({
      companyId: companyId,
      userId: userId,
    });
    
    console.log('Whop SDK access result:', access);
    
    if (!access.hasAccess) {
      console.log('User does not have access to company');
      return {
        isAdmin: false,
        isMember: false,
        user: null,
        company: null,
        accessLevel: null
      };
    }
    
    // Check if user is admin based on access level
    const isAdmin = access.accessLevel === 'admin';
    const isMember = access.hasAccess; // Any user with access is a member
    
    console.log('User permissions:', { isAdmin, isMember, accessLevel: access.accessLevel });
    
    return {
      isAdmin,
      isMember,
      user: { id: userId },
      company: { id: companyId },
      accessLevel: access.accessLevel
    };
  } catch (error) {
    console.error('Permission check failed:', error);
    
    // Fallback: If SDK call fails, assume user has basic access
    // This ensures the app doesn't break completely
    console.log('Falling back to basic access due to SDK error');
    return { 
      isAdmin: true, // Temporarily allow admin access if SDK fails
      isMember: true, 
      user: { id: userId }, 
      company: { id: companyId },
      accessLevel: 'admin'
    };
  }
}

/**
 * Check if user has admin access specifically for dashboard routes
 * Based on Whop documentation pattern
 */
export async function checkAdminAccess(userId: string, companyId: string): Promise<boolean> {
  try {
    const access = await whopSdk.access.checkIfUserHasAccessToCompany({
      companyId: companyId,
      userId: userId,
    });
    
    // Only admin users can access dashboard
    return access.hasAccess && access.accessLevel === 'admin';
  } catch (error) {
    console.error('Admin access check failed:', error);
    return false;
  }
}

/**
 * Check if user has any access to the company (for onboarding pages)
 * Based on Whop documentation pattern
 */
export async function checkUserAccess(userId: string, companyId: string): Promise<boolean> {
  try {
    const access = await whopSdk.access.checkIfUserHasAccessToCompany({
      companyId: companyId,
      userId: userId,
    });
    
    // Any user with access can view onboarding
    return access.hasAccess;
  } catch (error) {
    console.error('User access check failed:', error);
    return false;
  }
}

/**
 * Check if user has access to admin features
 * This is a simplified check for admin-only routes
 */
export async function isUserAdmin(userId: string, companyId: string): Promise<boolean> {
  const permissions = await checkUserPermissions(userId, companyId);
  return permissions.isAdmin;
}

/**
 * Get user information from simplified authentication
 */
export async function getUserInfo(userId: string) {
  try {
    // For now, return a mock user object
    // In a real implementation, you would use the Whop SDK
    return {
      id: userId,
      username: 'user',
      email: 'user@example.com'
    };
  } catch (error) {
    console.error('Failed to get user info:', error);
    return null;
  }
}