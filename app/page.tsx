import { redirect } from 'next/navigation';
import { whopSdk } from '@/lib/shared/whop-sdk';
import { headers } from 'next/headers';
import ClientPage from './ClientPage';

/**
 * Root Page - Role-Based Access Control
 * 
 * Fetches user info using Whop SDK and routes based on access level:
 * - admin: Full access to admin dashboard + onboarding page
 * - customer: Only onboarding page
 * - no_access: Access denied or redirect
 */
export default async function Page() {
          try {
            // Fetch headers and verify user token - using same pattern as example
            const headersList = await headers();
            
            console.log('Page Debug - Headers available:', Object.keys(headersList).length);
            console.log('Page Debug - Authorization header:', headersList.get('authorization') ? 'Present' : 'Missing');
            console.log('Page Debug - Whop token header:', headersList.get('x-whop-user-token') ? 'Present' : 'Missing');
            
            const { userId } = await whopSdk.verifyUserToken(headersList);
            
            console.log('Page Debug - User ID from SDK:', userId || 'No user ID');
    
    if (!userId) {
      // No authenticated user - show onboarding page as default
      return <ClientPage />;
    }

            // Check company access for admin role
            const companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;
            let accessLevel = 'customer'; // Default to customer
            
            if (companyId) {
              try {
                // Use the new SDK pattern with withUser() and withCompany()
                const accessCheck = await whopSdk
                  .withUser(userId)
                  .withCompany(companyId)
                  .access.checkIfUserHasAccessToCompany({
                    userId,
                    companyId
                  });
                accessLevel = accessCheck.accessLevel;
              } catch (error) {
                console.error('Error checking company access:', error);
                // Default to customer on error
                accessLevel = 'customer';
              }
            }

    // Conditional rendering based on access level
    if (accessLevel === 'admin') {
      // Admin: Show full access (already handled by ClientPage)
      return <ClientPage accessLevel={accessLevel} userId={userId} />;
    } else if (accessLevel === 'customer') {
      // Customer: Show onboarding page only
      return <ClientPage accessLevel={accessLevel} userId={userId} />;
    } else {
      // No access: Show access denied
      return (
        <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-400">You don't have access to this application.</p>
          </div>
        </div>
      );
    }
  } catch (error) {
    console.error('Auth error:', error);
    // On error, show onboarding page as default
    return <ClientPage />;
  }
}
