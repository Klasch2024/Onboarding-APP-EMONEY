import { whopSdk } from './whop-sdk';
import { headers } from 'next/headers';

/**
 * Authentication Utilities
 * 
 * This file contains utilities for checking user roles and permissions
 * using the Whop SDK. It handles:
 * - User authentication verification
 * - Admin role checking
 * - Company membership verification
 */

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  companyId?: string;
}

/**
 * Get user information from Whop SDK
 * @param companyId - The company ID to check admin status for
 * @returns User information including admin status
 */
export async function getUserInfo(companyId?: string): Promise<UserInfo | null> {
  try {
    // Get headers from the request
    const headersList = await headers();
    const authorization = headersList.get('authorization');
    
    if (!authorization) {
      return null;
    }

    // Extract token from Authorization header
    const token = authorization.replace('Bearer ', '');
    
    // Verify the token and get user info
    const user = await whopSdk.users.retrieve(token);
    
    if (!user) {
      return null;
    }

    // Check if user is admin of the company
    let isAdmin = false;
    if (companyId) {
      try {
        const membership = await whopSdk.companies.memberships.retrieve({
          company_id: companyId,
          user_id: user.id,
        });
        isAdmin = membership?.role === 'admin' || membership?.role === 'owner';
      } catch (error) {
        // User might not be a member of this company
        isAdmin = false;
      }
    }

    return {
      id: user.id,
      username: user.username || '',
      email: user.email || '',
      isAdmin,
      companyId,
    };
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
}

/**
 * Check if the current user is an admin of the specified company
 * @param companyId - The company ID to check
 * @returns Promise<boolean> - True if user is admin, false otherwise
 */
export async function isUserAdmin(companyId?: string): Promise<boolean> {
  const userInfo = await getUserInfo(companyId);
  return userInfo?.isAdmin || false;
}

/**
 * Get company ID from URL parameters or headers
 * @param params - URL parameters
 * @returns Company ID if available
 */
export function getCompanyId(params: any): string | undefined {
  return params?.companyId || params?.experienceId;
}
