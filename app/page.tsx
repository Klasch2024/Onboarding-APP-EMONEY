import { redirect } from 'next/navigation';

export default async function Page() {
	// Redirect to debug page to check access levels
	redirect('/debug');
}
