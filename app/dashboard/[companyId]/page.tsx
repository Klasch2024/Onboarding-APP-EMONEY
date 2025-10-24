import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { checkAdminAccess } from '@/lib/auth';

/**
 * Dashboard Page Component
 * 
 * This page implements admin access control using Whop SDK.
 * Only users with accessLevel === "admin" can access this dashboard.
 * Non-admin users are redirected to the onboarding page.
 * 
 * Based on Whop documentation pattern for access control.
 */
export default async function DashboardPage({
	params,
}: {
	params: Promise<{ companyId: string }>;
}) {
	const { companyId } = await params;
	
	// Get user info from headers
	const headersList = await headers();
	const userId = headersList.get('x-whop-user-id') || headersList.get('x-user-id');
	
	// If no user info, redirect to onboarding
	if (!userId) {
		redirect('/experiences/default');
	}
	
	try {
		// Check if user has admin access using Whop SDK
		const hasAdminAccess = await checkAdminAccess(userId, companyId);
		
		if (!hasAdminAccess) {
			console.log('User does not have admin access, redirecting to onboarding');
			// Redirect non-admin users to onboarding page
			redirect('/experiences/default');
		}
		
		console.log('Admin access confirmed, redirecting to builder');
		// Admin users get redirected to the builder
		redirect('/builder');
	} catch (error) {
		console.error('Admin access check failed:', error);
		// On error, redirect to onboarding page
		redirect('/experiences/default');
	}
}
