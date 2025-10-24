import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { checkUserAccessToExperience } from '@/lib/auth';
import PreviewScreen from '@/components/PreviewScreen';

/**
 * Experience Page Component
 * 
 * This page implements Whop access control using the official SDK method.
 * Uses whopSdk.access.checkIfUserHasAccessToExperience() to determine access level.
 * 
 * Access levels based on Whop documentation:
 * - "admin": Company administrators → redirect to /dashboard/default
 * - "customer" + hasAccess: true: Regular paying members → show onboarding experience
 * - "no_access" or no access: Users without access → redirect to /unauthorized
 * 
 * Reference: Whop Experience View documentation pattern
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
		
		// Handle different access levels based on Whop documentation
		if (access.accessLevel === "admin") {
			console.log('Admin user accessing experience, redirecting to admin dashboard');
			// Admin users should be redirected to admin dashboard
			redirect('/dashboard/default');
		} else if (access.accessLevel === "customer" && access.hasAccess === true) {
			console.log('Customer user with access, showing onboarding experience');
			// Customer users with access can view the onboarding experience
			return <PreviewScreen />;
		} else {
			console.log('User does not have access to experience, redirecting to unauthorized');
			// No access or invalid access level - redirect to unauthorized
			redirect('/unauthorized');
		}
	} catch (error) {
		console.error('User access check failed:', error);
		// On error, redirect to unauthorized page
		redirect('/unauthorized');
	}
}
