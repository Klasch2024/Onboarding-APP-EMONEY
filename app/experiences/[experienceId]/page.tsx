import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { checkUserAccessToExperience } from '@/lib/auth';
import PreviewScreen from '@/components/PreviewScreen';

/**
 * Experience Page Component
 * 
 * This page implements user access control using Whop SDK.
 * Uses checkIfUserHasAccessToExperience to determine access level.
 * 
 * Access levels:
 * - "admin": Company admins (should see admin dashboard)
 * - "customer": Regular members (should see onboarding page)
 * - "no_access": No access (redirect to unauthorized)
 */
export default async function ExperiencePage({
	params,
}: {
	params: Promise<{ experienceId: string }>;
}) {
	const { experienceId } = await params;
	
	// Get user info from headers
	const headersList = await headers();
	const userId = headersList.get('x-whop-user-id') || headersList.get('x-user-id');
	
	// If no user info, redirect to unauthorized
	if (!userId) {
		redirect('/unauthorized');
	}
	
	try {
		// Check user access to the specific experience using Whop SDK
		const access = await checkUserAccessToExperience(userId, experienceId);
		
		console.log('User access to experience:', access);
		
		// Handle different access levels
		if (access.accessLevel === "admin") {
			console.log('Admin user accessing experience, redirecting to admin dashboard');
			// Admin users should be redirected to admin dashboard
			redirect('/dashboard/default');
		} else if (access.hasAccess) {
			console.log('User has access to experience, showing onboarding');
			// Regular users with access can view the onboarding experience
			return <PreviewScreen />;
		} else {
			console.log('User does not have access to experience, redirecting to unauthorized');
			// No access - redirect to unauthorized
			redirect('/unauthorized');
		}
	} catch (error) {
		console.error('User access check failed:', error);
		// On error, redirect to unauthorized page
		redirect('/unauthorized');
	}
}
