import { checkUserAccess } from '@/lib/access-control';
import RoleBasedLayout from '@/components/RoleBasedLayout';

/**
 * Dashboard Page Component with Role-Based Access Control
 * 
 * This page implements role-based access control:
 * - Admins: Can access the full onboarding builder with editing capabilities
 * - Members: Can only view the onboarding content (read-only)
 */
export default async function DashboardPage({
	params,
}: {
	params: Promise<{ companyId: string }>;
}) {
	const { companyId } = await params;
	
	// Check user access level
	const accessResult = await checkUserAccess(companyId);
	
	// If access check failed, show a more helpful error page
	if (accessResult.error) {
		return (
			<div className="min-h-screen bg-[#111111] flex items-center justify-center">
				<div className="text-center max-w-md mx-auto p-6">
					<h1 className="text-2xl font-bold text-white mb-4">Access Required</h1>
					<p className="text-[#888888] mb-6">
						{accessResult.error}
					</p>
					<div className="space-y-4">
						<p className="text-sm text-[#666]">
							This app requires proper Whop integration. Please ensure:
						</p>
						<ul className="text-sm text-[#666] text-left space-y-1">
							<li>• Your app is properly installed in Whop</li>
							<li>• You're accessing through Whop's interface</li>
							<li>• Your environment variables are configured</li>
						</ul>
						<div className="pt-4">
							<a 
								href="/test" 
								className="inline-block px-4 py-2 bg-[#4a7fff] text-white rounded-lg hover:bg-[#3a6bcc] transition-colors"
							>
								Try Test Mode
							</a>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Determine if user is admin
	const isAdmin = accessResult.accessLevel === 'admin';

	return (
		<RoleBasedLayout 
			isAdmin={isAdmin} 
			companyId={companyId}
		/>
	);
}
