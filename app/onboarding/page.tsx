'use client';

import Layout from '@/components/Layout';
import PreviewScreen from '@/components/PreviewScreen';
import { useOnboardingStore } from '@/lib/store';

/**
 * Member Onboarding Page
 * 
 * This page displays the onboarding content created by admins.
 * Regular members see this page when they access the app.
 */
export default function MemberOnboarding() {
  const { screens } = useOnboardingStore();

  return (
    <Layout>
      {/* Member Header */}
      <div className="bg-[#1a1a1a] border-b border-[#3a3a3a] p-4">
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-semibold text-white">
            Welcome to Our Community!
          </h1>
        </div>
      </div>

      {/* Onboarding Content */}
      <div className="flex-1 overflow-auto">
        {screens.length > 0 ? (
          <PreviewScreen />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white mb-4">
                No Onboarding Content Available
              </h2>
              <p className="text-[#888888]">
                The community admins haven't set up onboarding content yet.
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
