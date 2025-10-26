import { redirect } from 'next/navigation';

/**
 * Dashboard Page Component
 * 
 * This page redirects users to the onboarding experience.
 * Admins will have additional access to the builder through the onboarding page.
 */
export default async function DashboardPage({
	params,
}: {
	params: Promise<{ companyId: string }>;
}) {
	// All users go to onboarding - admins will see additional controls there
	redirect('/onboarding');
}
