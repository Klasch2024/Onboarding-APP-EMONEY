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
    // Check if we're in development mode
    if (process.env.NODE_ENV === 'development') {
      return {
        isAdmin: true,
        isMember: true,
        user: { id: userId, username: 'dev-user' },
        company: { id: companyId, name: 'dev-company' },
        accessLevel: 'admin'
      };
    }
    
    // Use Whop SDK to check user access to company
    const access = await whopSdk.access.checkIfUserHasAccessToCompany({
      companyId: companyId,
      userId: userId,
    });
    
    if (!access.hasAccess) {
      return {
        isAdmin: false,
        isMember: false,
        user: null,
        company: null,
        accessLevel: null
      };
    }
    
    const isAdmin = access.accessLevel === 'admin';
    const isMember = access.hasAccess; // If user has access, they are a member
    
    return {
      isAdmin,
      isMember,
      user: { id: userId },
      company: { id: companyId },
      accessLevel: access.accessLevel
    };
  } catch (error) {
    console.error('Permission check failed:', error);
    return { 
      isAdmin: false, 
      isMember: false, 
      user: null, 
      company: null,
      accessLevel: null
    };
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