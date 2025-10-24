import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { checkUserAccess } from '@/lib/auth';
import PreviewScreen from '@/components/PreviewScreen';

/**
 * Experience Page Component
 * 
 * This page implements user access control using Whop SDK.
 * Any user with hasAccess: true can view the onboarding experience.
 * Users without access are redirected to unauthorized page.
 * 
 * Based on Whop documentation pattern for access control.
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
	const companyId = headersList.get('x-whop-company-id') || headersList.get('x-company-id');
	
	// If no user info, redirect to unauthorized
	if (!userId || !companyId) {
		redirect('/unauthorized');
	}
	
	try {
		// Check if user has any access to the company using Whop SDK
		const hasUserAccess = await checkUserAccess(userId, companyId);
		
		if (!hasUserAccess) {
			console.log('User does not have access to company, redirecting to unauthorized');
			redirect('/unauthorized');
		}
		
		console.log('User access confirmed, showing onboarding experience');
		// User has access, show the onboarding experience
		return <PreviewScreen />;
	} catch (error) {
		console.error('User access check failed:', error);
		// On error, redirect to unauthorized page
		redirect('/unauthorized');
	}
}
