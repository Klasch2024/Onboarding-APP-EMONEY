import { redirect } from 'next/navigation';

/**
 * Dashboard Page Component
 * 
 * This page redirects users to the onboarding builder.
 */
export default function DashboardPage({
	params,
}: {
	params: Promise<{ companyId: string }>;
}) {
	// Redirect to the builder page
	redirect('/admin/builder');
}
