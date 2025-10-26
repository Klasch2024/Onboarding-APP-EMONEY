import { redirect } from 'next/navigation';

export default function Page() {
	// Redirect to onboarding page by default
	// Role-based routing will be handled by dashboard/experience pages
	redirect('/onboarding');
}
