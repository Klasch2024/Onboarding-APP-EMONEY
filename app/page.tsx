'use client';

import { useUserRole } from '@/hooks/useUserRole';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
	const { user, isAdmin, isLoading } = useUserRole();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading) {
			console.log('🚀 Main Page Routing Debug:');
			console.log('- User:', user);
			console.log('- IsAdmin:', isAdmin);
			console.log('- IsLoading:', isLoading);
			
			if (user && isAdmin) {
				console.log('✅ Redirecting admin to /builder');
				// Admin users go to builder
				router.push('/builder');
			} else {
				console.log('✅ Redirecting member/no-user to /onboarding');
				// All other users (members or no user) go to onboarding
				router.push('/onboarding');
			}
		}
	}, [user, isAdmin, isLoading, router]);

	// Show loading while determining user role
	return (
		<div className="min-h-screen bg-[#111111] flex items-center justify-center">
			<div className="text-center">
				<div className="text-white mb-4">Loading...</div>
				{!isLoading && (
					<div className="text-sm text-[#888888] space-y-2">
						<div>User: {user ? `${user.name} (${user.role})` : 'None'}</div>
						<div>IsAdmin: {isAdmin ? 'Yes' : 'No'}</div>
						<div>URL: {typeof window !== 'undefined' ? window.location.href : 'Loading...'}</div>
					</div>
				)}
			</div>
		</div>
	);
}
