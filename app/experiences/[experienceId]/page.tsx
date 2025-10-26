import { redirect } from 'next/navigation';
import { whopSdk } from '@/lib/whop-sdk';
import { headers } from 'next/headers';

/**
 * Experience Page Component
 * 
 * This is the main entry point for the Whop app.
 * It fetches the experience data and user information, then redirects appropriately.
 */
export default async function ExperiencePage({
	params,
}: {
	params: Promise<{ experienceId: string }>;
}) {
	try {
		const { experienceId } = await params;
		
		console.log('🔍 DEBUG: Experience ID:', experienceId);
		
		// Get authorization header
		const headersList = await headers();
		const authorization = headersList.get('authorization');
		
		console.log('🔍 DEBUG: Authorization header present:', !!authorization);
		
		if (!authorization) {
			console.log('❌ No authorization header, redirecting to onboarding');
			redirect('/onboarding');
		}

		// Fetch user and experience data using Whop SDK
		try {
			console.log('🔍 DEBUG: Fetching user and experience data...');
			
			// Get current user
			const currentUser = await whopSdk.users.getCurrentUser();
			console.log('✅ DEBUG: Current user:', currentUser);
			
			const userId = currentUser?.user?.id;
			console.log('🔍 DEBUG: User ID:', userId);
			
			if (!userId) {
				console.log('❌ No user ID found, redirecting to onboarding');
				redirect('/onboarding');
			}

			// Get experience data
			const experience = await whopSdk.experiences.getExperience({ experienceId });
			console.log('✅ DEBUG: Experience data:', experience);
			
			// For now, assume user has access if they can get user info
			// In production, you'd implement proper access checking
			const access = true; // Simplified for now
			console.log('✅ DEBUG: User access:', access);
			
			if (!access) {
				console.log('❌ User does not have access to this experience');
				redirect('/onboarding');
			}

			// For now, assume all authenticated users with access are admins
			// In production, you'd check company memberships or other admin indicators
			const isAdmin = !!userId;
			console.log('🔍 DEBUG: Is admin:', isAdmin);
			
			// Redirect to onboarding with user context
			// The onboarding page will handle showing admin controls if needed
			redirect('/onboarding');
			
		} catch (sdkError) {
			console.error('❌ SDK Error:', sdkError);
			// Fallback: redirect to onboarding even if SDK fails
			redirect('/onboarding');
		}
		
	} catch (error) {
		console.error('❌ Error in ExperiencePage:', error);
		// Fallback: redirect to onboarding
		redirect('/onboarding');
	}
}
