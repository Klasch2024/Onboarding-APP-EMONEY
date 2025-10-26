import { redirect } from 'next/navigation';
import { getUserInfo } from '@/lib/auth';

/**
 * Dashboard Page Component
 * 
 * This page handles role-based routing:
 * - Admins are redirected to the admin dashboard
 * - Regular members are redirected to the onboarding page
 */
export default async function DashboardPage({
	params,
}: {
	params: Promise<{ companyId: string }>;
}) {
	const { companyId } = await params;
	
	// Get user information and check admin status
	const userInfo = await getUserInfo(companyId);
	
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
