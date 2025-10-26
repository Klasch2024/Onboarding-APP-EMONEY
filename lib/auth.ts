import { whopSdk } from './whop-sdk';
import { headers } from 'next/headers';

/**
 * Check if the current user is an admin of the company
 * @returns Promise<boolean> - true if user is admin, false otherwise
 */
export async function isUserAdmin(): Promise<boolean> {
	try {
		// Get the authorization header from Next.js headers
		const headersList = await headers();
		const authorization = headersList.get('authorization');
		
		console.log('🔍 DEBUG: Authorization header:', authorization ? 'Present' : 'Missing');
		console.log('🔍 DEBUG: Full headers:', Object.fromEntries(headersList.entries()));

		// Return false if no authorization header
		if (!authorization) {
			console.log('❌ No authorization header found');
			return false;
		}

		// Try to validate with Whop SDK
		try {
			// Check if we can get user info from the SDK
			const userInfo = await whopSdk.users.getCurrentUser();
			console.log('✅ DEBUG: User info from SDK:', userInfo);
			
			// The SDK returns a structure with user property
			const user = userInfo?.user;
			console.log('🔍 DEBUG: User object:', user);
			
			// For now, let's assume all authenticated users are admins
			// In production, you'd check company memberships or other admin indicators
			const isAdmin = !!user; // If we can get user info, assume admin for now
			
			console.log('🔍 DEBUG: User ID:', user?.id);
			console.log('🔍 DEBUG: Is admin:', isAdmin);
			
			return isAdmin;
		} catch (sdkError) {
			console.error('❌ SDK Error:', sdkError);
			
			// Fallback: Check if we have company ID and user seems to be admin
			const companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;
			console.log('🔍 DEBUG: Company ID:', companyId);
			
			// For development, let's be more permissive
			// In production, this should be more strict
			console.log('🔍 DEBUG: Development mode - checking authorization header format');
			
			// If we have a valid-looking authorization header, assume admin for now
			if (authorization.startsWith('Bearer ') || authorization.includes('whop')) {
				console.log('✅ DEBUG: Valid-looking auth header, assuming admin');
				return true;
			}
			
			return false;
		}
	} catch (error) {
		console.error('❌ Error checking user admin status:', error);
		return false;
	}
}

/**
 * Get the current authenticated user
 * @returns Promise<{ userId: string; isAdmin: boolean } | null>
 */
export async function getCurrentUser(): Promise<{
	userId: string;
	isAdmin: boolean;
	userInfo?: any;
} | null> {
	try {
		// Get the authorization header from Next.js headers
		const headersList = await headers();
		const authorization = headersList.get('authorization');

		console.log('🔍 DEBUG: Getting current user...');
		console.log('🔍 DEBUG: Authorization header present:', !!authorization);

		if (!authorization) {
			console.log('❌ No authorization header for getCurrentUser');
			return null;
		}

		// Try to get user info from Whop SDK
		try {
			const userInfo = await whopSdk.users.getCurrentUser();
			console.log('✅ DEBUG: User info retrieved:', userInfo);
			
			const user = userInfo?.user;
			const isAdmin = await isUserAdmin();
			
			return {
				userId: user?.id || 'unknown',
				isAdmin,
				userInfo,
			};
		} catch (sdkError) {
			console.error('❌ SDK Error in getCurrentUser:', sdkError);
			
			// Fallback with mock data for debugging
			const isAdmin = await isUserAdmin();
			
			return {
				userId: 'fallback-user',
				isAdmin,
				userInfo: { error: 'SDK Error', details: sdkError },
			};
		}
	} catch (error) {
		console.error('❌ Error getting current user:', error);
		return null;
	}
}

/**
 * Check if user has access to a specific experience
 * @param experienceId - The experience ID to check access for
 * @returns Promise<boolean>
 */
export async function hasExperienceAccess(
	experienceId: string
): Promise<boolean> {
	try {
		// Get the authorization header from Next.js headers
		const headersList = await headers();
		const authorization = headersList.get('authorization');

		if (!authorization) {
			return false;
		}

		// For now, return true for development/testing
		// TODO: Implement proper experience access check with Whop SDK
		console.log('Experience access check: returning true for development');
		return true;
	} catch (error) {
		console.error('Error checking experience access:', error);
		return false;
	}
}
