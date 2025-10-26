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

		// Return false if no authorization header
		if (!authorization) {
			console.log('No authorization header found');
			return false;
		}

		// For now, return true for development/testing
		// TODO: Implement proper admin check with Whop SDK
		console.log('Admin check: returning true for development');
		return true;
	} catch (error) {
		console.error('Error checking user admin status:', error);
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
} | null> {
	try {
		// Get the authorization header from Next.js headers
		const headersList = await headers();
		const authorization = headersList.get('authorization');

		if (!authorization) {
			return null;
		}

		// For now, return a mock user for development/testing
		// TODO: Implement proper user validation with Whop SDK
		const isAdmin = await isUserAdmin();

		return {
			userId: 'dev-user-123',
			isAdmin,
		};
	} catch (error) {
		console.error('Error getting current user:', error);
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
