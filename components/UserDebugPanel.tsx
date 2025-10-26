'use client';

import { useEffect, useState } from 'react';

interface UserDebugInfo {
	userId: string;
	isAdmin: boolean;
	userInfo?: any;
}

export default function UserDebugPanel() {
	const [userInfo, setUserInfo] = useState<UserDebugInfo | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Fetch user info from our API
		const fetchUserInfo = async () => {
			try {
				const response = await fetch('/api/debug/user');
				if (!response.ok) {
					throw new Error('Failed to fetch user info');
				}
				const data = await response.json();
				setUserInfo(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Unknown error');
			} finally {
				setLoading(false);
			}
		};

		fetchUserInfo();
	}, []);

	if (loading) {
		return (
			<div className="fixed top-4 right-4 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-4 text-white text-sm max-w-md z-50">
				<div className="flex items-center space-x-2">
					<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#4a7fff]"></div>
					<span>Loading user info...</span>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="fixed top-4 right-4 bg-red-900 border border-red-700 rounded-lg p-4 text-white text-sm max-w-md z-50">
				<div className="font-semibold text-red-200 mb-2">Debug Error</div>
				<div className="text-red-300">{error}</div>
			</div>
		);
	}

	return (
		<div className="fixed top-4 right-4 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-4 text-white text-sm max-w-md z-50">
			<div className="font-semibold text-[#4a7fff] mb-3">🔍 User Debug Info</div>
			
			<div className="space-y-2">
				<div>
					<span className="text-[#888888]">User ID:</span>
					<span className="ml-2 font-mono text-xs">{userInfo?.userId || 'Unknown'}</span>
				</div>
				
				<div>
					<span className="text-[#888888]">Is Admin:</span>
					<span className={`ml-2 px-2 py-1 rounded text-xs ${
						userInfo?.isAdmin 
							? 'bg-green-900 text-green-200' 
							: 'bg-red-900 text-red-200'
					}`}>
						{userInfo?.isAdmin ? '✅ Yes' : '❌ No'}
					</span>
				</div>
				
				{userInfo?.userInfo && (
					<div>
						<span className="text-[#888888]">User Info:</span>
						<pre className="mt-1 p-2 bg-[#1a1a1a] rounded text-xs overflow-auto max-h-32">
							{JSON.stringify(userInfo.userInfo, null, 2)}
						</pre>
					</div>
				)}
			</div>
			
			<div className="mt-3 pt-2 border-t border-[#3a3a3a] text-xs text-[#888888]">
				Check browser console for detailed logs
			</div>
		</div>
	);
}
