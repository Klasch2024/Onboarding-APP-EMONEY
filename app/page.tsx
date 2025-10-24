import { redirect } from 'next/navigation';

export default function Page() {
	// Redirect to the onboarding experience for normal users
	// Admins can access /admin to get redirected to builder
	redirect('/experiences/default');
}
