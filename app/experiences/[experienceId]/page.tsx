import { redirect } from 'next/navigation';

/**
 * Experience Page Component
 * 
 * This page redirects users to the onboarding builder.
 * The onboarding builder is the main interface for creating
 * and customizing onboarding flows.
 */
export default async function ExperiencePage({
	params,
}: {
	params: Promise<{ experienceId: string }>;
}) {
	// Redirect to the builder page
	redirect('/builder');
}
