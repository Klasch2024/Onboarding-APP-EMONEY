import RoleBasedLayout from '@/components/RoleBasedLayout';

/**
 * Test Page Component
 * 
 * This page bypasses authentication for testing purposes.
 * Use this to test the role-based layout without Whop integration.
 */
export default function TestPage() {
  // For testing: simulate admin access
  const isAdmin = true;
  const companyId = 'test-company';

  return (
    <RoleBasedLayout 
      isAdmin={isAdmin} 
      companyId={companyId}
    />
  );
}
