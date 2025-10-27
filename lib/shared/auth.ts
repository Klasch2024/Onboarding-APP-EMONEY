import { whopSdk } from './whop-sdk';
import { headers } from 'next/headers';

/**
 * Authentication and Access Control Utilities
 * 
 * This module provides functions for:
 * - User token verification
 * - Access level checking
 * - Admin permission validation
 */

export interface UserVerification {
  success: boolean;
  userId?: string;
  error?: string;
}

export interface AccessCheck {
  accessLevel: 'admin' | 'customer' | 'no_access';
  hasAccess: boolean;
}

export interface CurrentUser {
  userId: string;
  isAdmin: boolean;
  accessLevel: 'admin' | 'customer' | 'no_access';
}

/**
 * Verify user token and get user ID
 */
export async function verifyUserToken(): Promise<UserVerification> {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    const cookieToken = headersList.get('cookie')?.match(/whop-token=([^;]+)/)?.[1];
    
    const token = authHeader?.replace('Bearer ', '') || cookieToken;
    
    if (!token) {
      return { success: false, error: 'No token provided' };
    }

    // Set the authorization header for the SDK
    headersList.set('authorization', `Bearer ${token}`);

    const verification = await whopSdk.verifyUserToken(headersList);

    if (!verification || !verification.userId) {
      return { success: false, error: 'Invalid token' };
    }

    return { success: true, userId: verification.userId };
  } catch (error) {
    console.error('Token verification error:', error);
    return { success: false, error: 'Verification failed' };
  }
}

/**
 * Check if user has admin access to the company
 */
export async function checkAdminAccess(userId: string): Promise<AccessCheck> {
  try {
    const companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;
    
    if (!companyId) {
      throw new Error('Company ID not configured');
    }

    const accessCheck = await whopSdk.access.checkIfUserHasAccessToCompany({
      userId,
      companyId
    });

    const hasAccess = accessCheck.accessLevel === 'admin';
    
    return {
      accessLevel: accessCheck.accessLevel,
      hasAccess
    };
  } catch (error) {
    console.error('Admin access check error:', error);
    return { accessLevel: 'no_access', hasAccess: false };
  }
}

/**
 * Check if user has access to a specific experience
 */
export async function checkExperienceAccess(userId: string, experienceId: string): Promise<AccessCheck> {
  try {
    const accessCheck = await whopSdk.access.checkIfUserHasAccessToExperience({
      userId,
      experienceId
    });

    const hasAccess = accessCheck.accessLevel !== 'no_access';
    
    return {
      accessLevel: accessCheck.accessLevel,
      hasAccess
    };
  } catch (error) {
    console.error('Experience access check error:', error);
    return { accessLevel: 'no_access', hasAccess: false };
  }
}

/**
 * Get current user info (if authenticated)
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const verification = await verifyUserToken();
  
  if (!verification.success || !verification.userId) {
    return null;
  }

  const adminAccess = await checkAdminAccess(verification.userId);

  return {
    userId: verification.userId,
    isAdmin: adminAccess.hasAccess,
    accessLevel: adminAccess.accessLevel
  };
}
