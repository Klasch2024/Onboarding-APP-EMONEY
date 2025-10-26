import { redirect } from 'next/navigation';
import { isUserAdmin } from '@/lib/auth';

/**
 * Root Page Component
 * 
 * This page routes users based on their role:
 * - Admins are redirected to the builder
 * - Regular members are redirected to the onboarding view
 */
export default async function Page() {
	// Check if user is admin
	const isAdmin = await isUserAdmin();

	// Route based on admin status
	if (isAdmin) {
		redirect('/builder');
	} else {
		redirect('/onboarding');
	}
}
