import { redirect } from 'next/navigation';

/**
 * Dashboard Page Component
 * 
 * This page redirects users to the onboarding builder.
 * The onboarding builder is the main interface for creating
 * and customizing onboarding flows.
 */
export default async function DashboardPage({
	params,
}: {
	params: Promise<{ companyId: string }>;
}) {
	// Redirect to the builder page
	redirect('/builder');
}
