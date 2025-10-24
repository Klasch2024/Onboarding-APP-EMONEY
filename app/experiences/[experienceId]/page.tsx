import PreviewScreen from '@/components/PreviewScreen';

/**
 * Experience Page Component
 * 
 * This page is accessible to all users and shows the onboarding experience.
 * Regular users can only view the onboarding, not edit it.
 * Only admins can access the builder interface.
 */
export default async function ExperiencePage({
	params,
}: {
	params: Promise<{ experienceId: string }>;
}) {
	const { experienceId } = await params;
	
	// This page is accessible to all users
	// They can only view the onboarding, not edit it
	return <PreviewScreen />;
}
