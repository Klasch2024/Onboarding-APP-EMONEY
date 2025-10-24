import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { checkUserPermissions } from '@/lib/auth';

export default async function Page() {
	// Get user info from headers
	const headersList = await headers();
	const userId = headersList.get('x-whop-user-id') || headersList.get('x-user-id');
	const companyId = headersList.get('x-whop-company-id') || headersList.get('x-company-id');
	
	// If no user info, redirect to onboarding (will be handled by middleware)
	if (!userId || !companyId) {
		redirect('/experiences/default');
	}
	
	try {
		// Check user permissions
		const permissions = await checkUserPermissions(userId, companyId);
		
		if (permissions.isAdmin) {
			// Admin users get redirected to admin panel
			redirect('/admin');
		} else {
			// Regular users get redirected to onboarding experience
			redirect('/experiences/default');
		}
	} catch (error) {
		console.error('Permission check failed:', error);
		// Fallback to onboarding experience
		redirect('/experiences/default');
	}
}
