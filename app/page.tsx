import { redirect } from 'next/navigation';

/**
 * Root Page Component
 * 
 * This page redirects ALL users to the onboarding experience.
 * Admins will have additional access to the builder through the onboarding page.
 */
export default async function Page() {
	// All users go to onboarding - admins will see additional controls there
	redirect('/onboarding');
}
