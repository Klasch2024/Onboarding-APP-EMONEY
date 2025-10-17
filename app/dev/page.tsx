'use client';

import { useOnboardingStore } from '@/lib/store';
import { useUserRole } from '@/hooks/useUserRole';

export default function DevPage() {
  const { setUser, publishOnboarding, publishedOnboarding } = useOnboardingStore();
  const { user, isAdmin, isLoading } = useUserRole();

  const handleSetAdmin = () => {
    setUser({
      id: 'admin-123',
      role: 'admin',
      name: 'Community Admin',
      email: 'admin@example.com'
    });
  };

  const handleSetMember = () => {
    setUser({
      id: 'member-123',
      role: 'member',
      name: 'Community Member',
      email: 'member@example.com'
    });
  };

  const handlePublish = () => {
    publishOnboarding();
    alert('Onboarding published! Members can now see it.');
  };

  const handleClearUser = () => {
    // Clear stored user data
    localStorage.removeItem('onboarding-store');
    window.location.reload();
  };

  const handleToggleAdmin = () => {
    const currentOverride = localStorage.getItem('admin-override');
    if (currentOverride === 'true') {
      localStorage.removeItem('admin-override');
    } else {
      localStorage.setItem('admin-override', 'true');
    }
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Development Helper</h1>
        
        <div className="space-y-6">
          <div className="bg-[#2a2a2a] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Current User</h2>
            {isLoading ? (
              <p className="text-[#888888]">Loading user...</p>
            ) : user ? (
              <div className="space-y-2">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
                <p><strong>User ID:</strong> {user.id}</p>
              </div>
            ) : (
              <p className="text-[#888888]">No user set</p>
            )}
          </div>

          <div className="bg-[#2a2a2a] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Published Onboarding</h2>
            {publishedOnboarding ? (
              <div className="space-y-2">
                <p><strong>Published:</strong> {new Date(publishedOnboarding.publishedAt).toLocaleString()}</p>
                <p><strong>Screens:</strong> {publishedOnboarding.screens.length}</p>
                <p><strong>Published By:</strong> {publishedOnboarding.publishedBy}</p>
              </div>
            ) : (
              <p className="text-[#888888]">No published onboarding</p>
            )}
          </div>

          <div className="bg-[#2a2a2a] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Switch User Role</h2>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <button
                  onClick={handleSetAdmin}
                  className="bg-[#4a7fff] hover:bg-[#5a8fff] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Set as Admin
                </button>
                <button
                  onClick={handleSetMember}
                  className="bg-[#2a2a2a] border border-[#3a3a3a] hover:border-[#4a7fff] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Set as Member
                </button>
                <button
                  onClick={handleClearUser}
                  className="bg-[#ff6b6b] hover:bg-[#ff5555] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Clear & Reload
                </button>
                <button
                  onClick={handleToggleAdmin}
                  className="bg-[#ffa500] hover:bg-[#ff9500] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Toggle Admin Override
                </button>
              </div>
              <div>
                <p className="text-sm text-[#888888] mb-2">Quick Test URLs:</p>
                <div className="space-y-2">
                  <a
                    href="/?user=admin"
                    className="block text-[#4a7fff] hover:text-[#5a8fff] text-sm"
                  >
                    /?user=admin (Force Admin)
                  </a>
                  <a
                    href="/?user=member"
                    className="block text-[#4a7fff] hover:text-[#5a8fff] text-sm"
                  >
                    /?user=member (Force Member)
                  </a>
                </div>
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className="bg-[#2a2a2a] p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Admin Actions</h2>
              <button
                onClick={handlePublish}
                className="bg-[#ff6b6b] hover:bg-[#ff5555] text-white px-4 py-2 rounded-lg transition-colors"
              >
                Publish Onboarding
              </button>
            </div>
          )}

          <div className="bg-[#2a2a2a] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Navigation</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#888888] mb-2">Automatic Routing:</p>
                <div className="flex space-x-4">
                  <a
                    href="/"
                    className="bg-[#4a7fff] hover:bg-[#5a8fff] text-white px-4 py-2 rounded-lg transition-colors inline-block"
                  >
                    Home (Auto-redirect)
                  </a>
                </div>
              </div>
              <div>
                <p className="text-sm text-[#888888] mb-2">Manual Testing:</p>
                <div className="flex space-x-4">
                  <a
                    href="/builder"
                    className="bg-[#2a2a2a] border border-[#3a3a3a] hover:border-[#4a7fff] text-white px-4 py-2 rounded-lg transition-colors inline-block"
                  >
                    Builder (Admin only)
                  </a>
                  <a
                    href="/onboarding"
                    className="bg-[#2a2a2a] border border-[#3a3a3a] hover:border-[#4a7fff] text-white px-4 py-2 rounded-lg transition-colors inline-block"
                  >
                    Public Onboarding
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
