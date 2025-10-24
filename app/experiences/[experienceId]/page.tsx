import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { checkUserAccessToExperience } from '@/lib/auth';
import PreviewScreen from '@/components/PreviewScreen';

/**
 * Experience Page Component
 * 
 * This page implements exact Whop access control logic using the official SDK method.
 * Uses whopSdk.access.checkIfUserHasAccessToExperience(userId, experienceId) to determine access level.
 * 
 * Whop access levels:
 * 1. "admin" - Company administrators who manage the whop
 *    → Redirect to /dashboard/default to build onboarding experiences
 * 
 * 2. "customer" - Regular paying members who have purchased access
 *    → Show onboarding experience page (if hasAccess === true)
 * 
 * 3. "no_access" - Users without access
 *    → Redirect to /unauthorized
 * 
 * Implementation follows exact Whop SDK pattern for experience access control.
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
		console.log('=== EXPERIENCE PAGE ACCESS CHECK ===');
		console.log('User ID from headers:', userId);
		console.log('Experience ID from params:', experienceId);
		
		// Check user access to the specific experience using Whop SDK
		const access = await checkUserAccessToExperience(userId, experienceId);
		
		console.log('=== ACCESS DECISION LOGIC ===');
		console.log('Access result:', access);
		console.log('accessLevel:', access.accessLevel);
		console.log('hasAccess:', access.hasAccess);
		console.log('accessLevel === "admin":', access.accessLevel === "admin");
		console.log('accessLevel === "customer" && hasAccess === true:', access.accessLevel === "customer" && access.hasAccess === true);
		
		// Implement exact Whop access control logic
		if (access.accessLevel === "admin") {
			console.log('✅ ADMIN DETECTED: Redirecting to dashboard for building experiences');
			// Admin users should be redirected to dashboard to build onboarding experiences
			redirect('/dashboard/default');
		} else if (access.accessLevel === "customer" && access.hasAccess === true) {
			console.log('✅ CUSTOMER WITH ACCESS: Showing onboarding experience');
			// Customer users with valid access can view the onboarding experience
			return <PreviewScreen />;
		} else {
			console.log('❌ NO ACCESS: User has no access or invalid access level');
			console.log('Access level was:', access.accessLevel);
			console.log('Has access was:', access.hasAccess);
			console.log('Redirecting to unauthorized...');
			// All other users (no_access, customer without access, etc.) should be redirected to unauthorized
			redirect('/unauthorized');
		}
	} catch (error) {
		console.error('=== EXPERIENCE PAGE ERROR ===');
		console.error('User access check failed:', error);
		console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
		console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
		console.error('=== END EXPERIENCE PAGE ERROR ===');
		// On error, redirect to unauthorized page
		redirect('/unauthorized');
	}
}
