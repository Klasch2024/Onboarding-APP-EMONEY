import { redirect } from 'next/navigation';
import { getCurrentUser } from "@/lib/shared/auth";

export default async function Page() {
	// Check if user is authenticated and has admin access
	const user = await getCurrentUser();
	
	if (user && user.isAdmin) {
		// Admin user - redirect to admin builder (the actual onboarding app)
		redirect('/admin/builder');
	} else {
		// Non-admin or unauthenticated user - redirect to discover page
		redirect('/onboarding/discover');
	}
}
