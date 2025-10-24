import { redirect } from 'next/navigation';

/**
 * Dashboard Page Component
 * 
 * This page redirects admin users to the onboarding builder.
 * The onboarding builder is the main interface for creating
 * and customizing onboarding flows.
 * 
 * Access is controlled by middleware - only admins can reach this page.
 */
export default async function DashboardPage({
	params,
}: {
	params: Promise<{ companyId: string }>;
}) {
	const { companyId } = await params;
	
	// Redirect to the builder page (middleware ensures only admins can access)
	redirect('/builder');
}
