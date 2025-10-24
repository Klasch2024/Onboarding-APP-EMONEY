import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { checkUserPermissions } from '@/lib/auth';

export default async function AdminPage() {
	// Get user info from headers
	const headersList = await headers();
	const userId = headersList.get('x-whop-user-id') || headersList.get('x-user-id');
	const companyId = headersList.get('x-whop-company-id') || headersList.get('x-company-id');
	
	// If no user info, redirect to unauthorized
	if (!userId || !companyId) {
		redirect('/unauthorized');
	}
	
	try {
		// Check user permissions
		const permissions = await checkUserPermissions(userId, companyId);
		
		if (!permissions.isAdmin) {
			// Non-admin users get redirected to onboarding experience
			redirect('/experiences/default');
		}
		
		// Admin users get redirected to builder
		redirect('/builder');
	} catch (error) {
		console.error('Admin check failed:', error);
		redirect('/unauthorized');
	}
}
