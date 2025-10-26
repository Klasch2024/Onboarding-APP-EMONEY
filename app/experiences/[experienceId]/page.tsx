import { redirect } from 'next/navigation';
import { getUserInfo } from '@/lib/auth';

/**
 * Experience Page Component
 * 
 * This page handles role-based routing for experience access:
 * - Admins are redirected to the admin dashboard
 * - Regular members are redirected to the onboarding page
 */
export default async function ExperiencePage({
	params,
}: {
	params: Promise<{ experienceId: string }>;
}) {
	const { experienceId } = await params;
	
	// Get user information and check admin status
	// Using experienceId as companyId for admin check
	const userInfo = await getUserInfo(experienceId);
	
	if (!userInfo) {
		// If no user info, redirect to onboarding (fallback)
		redirect('/onboarding');
	}
	
	if (userInfo.isAdmin) {
		// Admin users go to the admin dashboard
		redirect('/admin');
	} else {
		// Regular members go to the onboarding page
		redirect('/onboarding');
	}
}
