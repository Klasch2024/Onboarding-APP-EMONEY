import { checkUserAccess } from '@/lib/access-control';
import RoleBasedLayout from '@/components/RoleBasedLayout';

/**
 * Experience Page Component with Role-Based Access Control
 * 
 * This page implements role-based access control for experiences:
 * - Admins: Can access the full onboarding builder with editing capabilities
 * - Members: Can only view the onboarding content (read-only)
 * 
 * Note: For experiences, we'll use a default company ID or extract it from the experience
 */
export default async function ExperiencePage({
	params,
}: {
	params: Promise<{ experienceId: string }>;
}) {
	const { experienceId } = await params;
	
	// For experiences, we might need to get the company ID from the experience
	// For now, we'll use a default or extract from environment
	const companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || 'default-company';
	
	// Check user access level
	const accessResult = await checkUserAccess(companyId);
	
	// If access check failed, show error or redirect
	if (accessResult.error) {
		return (
			<div className="min-h-screen bg-[#111111] flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
					<p className="text-[#888888]">{accessResult.error}</p>
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
