import { redirect } from 'next/navigation';
import { isUserAdmin } from '@/lib/auth';

/**
 * Experience Page Component
 * 
 * This page routes users based on their role:
 * - Admins are redirected to the builder
 * - Regular members are redirected to the onboarding view
 */
export default async function ExperiencePage({
	params,
}: {
	params: Promise<{ experienceId: string }>;
}) {
	// Check if user is admin
	const isAdmin = await isUserAdmin();

	// Route based on admin status
	if (isAdmin) {
		redirect('/builder');
	} else {
		redirect('/onboarding');
	}
}
