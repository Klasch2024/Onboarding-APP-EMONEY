import { whopSdk } from './whop-sdk';

export interface UserPermissions {
  isAdmin: boolean;
  isMember: boolean;
  user: any;
  company: any;
}

/**
 * Check user permissions using Whop SDK
 * This function verifies if a user has admin access to a company
 */
export async function checkUserPermissions(userId: string, companyId: string): Promise<UserPermissions> {
  try {
    // Check if user has admin access to the company
    const user = await whopSdk.users.retrieve(userId);
    
    // Get company information
    const company = await whopSdk.companies.retrieve(companyId);
    
    // Check user's membership and role in the company
    const memberships = await whopSdk.companies.memberships.list({
      company_id: companyId,
      user_id: userId
    });
    
    // Check if user has admin or owner role
    const isAdmin = memberships.data.some(m => 
      m.role === 'admin' || m.role === 'owner' || m.role === 'moderator'
    );
    
    const isMember = memberships.data.length > 0;
    
    return {
      isAdmin,
      isMember,
      user,
      company
    };
  } catch (error) {
    console.error('Permission check failed:', error);
    return { 
      isAdmin: false, 
      isMember: false, 
      user: null, 
      company: null 
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
 * Get user information from Whop SDK
 */
export async function getUserInfo(userId: string) {
  try {
    const user = await whopSdk.users.retrieve(userId);
    return user;
  } catch (error) {
    console.error('Failed to get user info:', error);
    return null;
  }
}
