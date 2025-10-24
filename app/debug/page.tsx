import { headers } from 'next/headers';
import { checkUserPermissions, checkUserAccessToExperience, checkAdminAccess } from '@/lib/auth';

export default async function DebugPage() {
  const headersList = await headers();
  const userId = headersList.get('x-whop-user-id') || headersList.get('x-user-id') || 'NO_USER_ID';
  const companyId = headersList.get('x-whop-company-id') || headersList.get('x-company-id') || 'NO_COMPANY_ID';
  const experienceId = 'default';

  console.log('=== DEBUG PAGE ACCESS ===');
  console.log('User ID:', userId);
  console.log('Company ID:', companyId);
  console.log('Experience ID:', experienceId);

  // Get all access information
  const userPermissions = await checkUserPermissions(userId, companyId);
  const userAccessToExperience = await checkUserAccessToExperience(userId, experienceId);
  const adminAccess = await checkAdminAccess(userId, companyId);

  return (
    <div className="min-h-screen bg-[#111111] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">🔍 Debug Access Information</h1>
        
        <div className="grid gap-6">
          {/* Headers Information */}
          <div className="bg-[#1a1a1a] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">📋 Request Headers</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">User ID:</span>
                <span className="text-white font-mono">{userId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Company ID:</span>
                <span className="text-white font-mono">{companyId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Experience ID:</span>
                <span className="text-white font-mono">{experienceId}</span>
              </div>
            </div>
          </div>

          {/* User Permissions */}
          <div className="bg-[#1a1a1a] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">👤 User Permissions</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Is Admin:</span>
                <span className={`font-bold ${userPermissions.isAdmin ? 'text-green-400' : 'text-red-400'}`}>
                  {userPermissions.isAdmin ? '✅ YES' : '❌ NO'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Is Member:</span>
                <span className={`font-bold ${userPermissions.isMember ? 'text-green-400' : 'text-red-400'}`}>
                  {userPermissions.isMember ? '✅ YES' : '❌ NO'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Access Level:</span>
                <span className="text-white font-mono">{userPermissions.accessLevel || 'null'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">User:</span>
                <span className="text-white font-mono">{JSON.stringify(userPermissions.user)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Company:</span>
                <span className="text-white font-mono">{JSON.stringify(userPermissions.company)}</span>
              </div>
            </div>
          </div>

          {/* Experience Access */}
          <div className="bg-[#1a1a1a] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">🎯 Experience Access</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Has Access:</span>
                <span className={`font-bold ${userAccessToExperience.hasAccess ? 'text-green-400' : 'text-red-400'}`}>
                  {userAccessToExperience.hasAccess ? '✅ YES' : '❌ NO'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Access Level:</span>
                <span className="text-white font-mono">{userAccessToExperience.accessLevel}</span>
              </div>
            </div>
          </div>

          {/* Admin Access */}
          <div className="bg-[#1a1a1a] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">🔐 Admin Access</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Admin Access:</span>
                <span className={`font-bold ${adminAccess ? 'text-green-400' : 'text-red-400'}`}>
                  {adminAccess ? '✅ YES' : '❌ NO'}
                </span>
              </div>
            </div>
          </div>

          {/* Environment Variables */}
          <div className="bg-[#1a1a1a] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">🌍 Environment</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">NODE_ENV:</span>
                <span className="text-white font-mono">{process.env.NODE_ENV}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">BYPASS_AUTH:</span>
                <span className="text-white font-mono">{process.env.BYPASS_AUTH || 'not set'}</span>
              </div>
            </div>
          </div>

          {/* Access Decision */}
          <div className="bg-[#1a1a1a] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">🎯 Access Decision</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Should Redirect to Dashboard:</span>
                <span className={`font-bold ${userAccessToExperience.accessLevel === 'admin' ? 'text-green-400' : 'text-red-400'}`}>
                  {userAccessToExperience.accessLevel === 'admin' ? '✅ YES' : '❌ NO'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Should Show Experience:</span>
                <span className={`font-bold ${userAccessToExperience.accessLevel === 'customer' && userAccessToExperience.hasAccess ? 'text-green-400' : 'text-red-400'}`}>
                  {userAccessToExperience.accessLevel === 'customer' && userAccessToExperience.hasAccess ? '✅ YES' : '❌ NO'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Should Redirect to Unauthorized:</span>
                <span className={`font-bold ${!userAccessToExperience.hasAccess || userAccessToExperience.accessLevel === 'no_access' ? 'text-green-400' : 'text-red-400'}`}>
                  {!userAccessToExperience.hasAccess || userAccessToExperience.accessLevel === 'no_access' ? '✅ YES' : '❌ NO'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#1a1a1a] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">🚀 Quick Actions</h2>
            <div className="flex gap-4">
              <a 
                href="/dashboard/default" 
                className="bg-[#4a7fff] text-white px-4 py-2 rounded-lg hover:bg-[#3a6bcc] transition-colors"
              >
                Go to Dashboard
              </a>
              <a 
                href="/experiences/default" 
                className="bg-[#4a7fff] text-white px-4 py-2 rounded-lg hover:bg-[#3a6bcc] transition-colors"
              >
                Go to Experience
              </a>
              <a 
                href="/builder" 
                className="bg-[#4a7fff] text-white px-4 py-2 rounded-lg hover:bg-[#3a6bcc] transition-colors"
              >
                Go to Builder
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
