'use client';

import { useOnboardingStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  fallbackPath?: string;
}

export default function RouteGuard({ 
  children, 
  requireAdmin = false, 
  fallbackPath = '/onboarding' 
}: RouteGuardProps) {
  const { user, isAdmin } = useOnboardingStore();
  const router = useRouter();

  useEffect(() => {
    // If no user is set, redirect to onboarding (public view)
    if (!user) {
      router.push(fallbackPath);
      return;
    }

    // If admin is required but user is not admin, redirect
    if (requireAdmin && !isAdmin) {
      router.push(fallbackPath);
      return;
    }
  }, [user, isAdmin, requireAdmin, router, fallbackPath]);

  // Show loading while checking permissions
  if (!user) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // If admin is required but user is not admin, show access denied
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-[#888888] mb-6">You need admin privileges to access this page.</p>
          <button
            onClick={() => router.push(fallbackPath)}
            className="bg-[#4a7fff] hover:bg-[#5a8fff] text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go to Onboarding
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
