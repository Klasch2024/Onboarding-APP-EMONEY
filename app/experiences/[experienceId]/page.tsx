import { redirect } from 'next/navigation';

/**
 * Experience Page Component
 * 
 * This page redirects users to the onboarding experience.
 * Admins will have additional access to the builder through the onboarding page.
 */
export default async function ExperiencePage({
	params,
}: {
	params: Promise<{ experienceId: string }>;
}) {
	// All users go to onboarding - admins will see additional controls there
	redirect('/onboarding');
}
