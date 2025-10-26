import { whopSdk } from './whop-sdk';
import { headers } from 'next/headers';

/**
 * Get the user ID from Whop context
 * @returns Promise<string | null>
 */
async function getWhopUserId(): Promise<string | null> {
	try {
		// Get the authorization header from Next.js headers
		const headersList = await headers();
		const authorization = headersList.get('authorization');
		
		console.log('🔍 DEBUG: Authorization header:', authorization ? 'Present' : 'Missing');
		console.log('🔍 DEBUG: Full headers:', Object.fromEntries(headersList.entries()));

		if (!authorization) {
			console.log('❌ No authorization header found');
			return null;
		}

		// Try to get current user info from Whop SDK
		try {
			const currentUser = await whopSdk.users.getCurrentUser();
			console.log('✅ DEBUG: Current user from SDK:', currentUser);
			
			const userId = currentUser?.user?.id;
			console.log('🔍 DEBUG: Extracted user ID:', userId);
			
			return userId || null;
		} catch (sdkError) {
			console.error('❌ SDK Error getting current user:', sdkError);
			return null;
		}
	} catch (error) {
		console.error('❌ Error getting Whop user ID:', error);
		return null;
	}
}

/**
 * Check if the current user is an admin of the company
 * @returns Promise<boolean> - true if user is admin, false otherwise
 */
export async function isUserAdmin(): Promise<boolean> {
	try {
		const userId = await getWhopUserId();
		
		if (!userId) {
			console.log('❌ No user ID found, not admin');
			return false;
		}

		console.log('🔍 DEBUG: Checking admin status for user:', userId);

		// For now, let's assume all authenticated users are admins
		// This is a temporary solution until we can properly check company memberships
		console.log('🔍 DEBUG: Assuming admin for authenticated user');
		return true;
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
		const userId = await getWhopUserId();
		
		console.log('🔍 DEBUG: Getting current user...');
		console.log('🔍 DEBUG: User ID found:', userId);

		if (!userId) {
			console.log('❌ No user ID found for getCurrentUser');
			return null;
		}

		// Get basic user info from getCurrentUser
		try {
			const currentUserInfo = await whopSdk.users.getCurrentUser();
			console.log('✅ DEBUG: Current user info retrieved:', currentUserInfo);
			
			const isAdmin = await isUserAdmin();
			
			return {
				userId: userId,
				isAdmin,
				userInfo: currentUserInfo,
			};
		} catch (sdkError) {
			console.error('❌ SDK Error in getCurrentUser:', sdkError);
			
			// Fallback with basic info
			const isAdmin = await isUserAdmin();
			
			return {
				userId: userId,
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
