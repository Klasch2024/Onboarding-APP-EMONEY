import { redirect } from 'next/navigation';
import { getCurrentUser } from "@/lib/shared/auth";

/**
 * Dashboard Page Component
 * 
 * This page redirects users to the onboarding builder.
 * Only admin users can access this page.
 */
export default async function DashboardPage({
	params,
}: {
	params: Promise<{ companyId: string }>;
}) {
	// Check if user is authenticated and has admin access
	const user = await getCurrentUser();
	
	if (!user || !user.isAdmin) {
		// Redirect non-admin users to onboarding discover page
		redirect("/onboarding/discover");
	}

	// Redirect to the builder page
	redirect('/admin/builder');
}
