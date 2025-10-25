import { redirect } from 'next/navigation';

export default function Page() {
	// For testing: redirect to test page that bypasses authentication
	redirect('/test');
}
