import { redirect } from 'next/navigation';

export default function Page() {
	// For now, redirect directly to admin builder
	// This ensures you see your onboarding app immediately
	redirect('/admin/builder');
}
