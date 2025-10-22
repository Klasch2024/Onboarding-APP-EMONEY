'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import ScreenList from '@/components/ScreenList';
import Canvas from '@/components/Canvas';
import ComponentEditor from '@/components/ComponentEditor';
import PreviewScreen from '@/components/PreviewScreen';
import { useOnboardingStore } from '@/lib/store';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function BuilderPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);
  const router = useRouter();
  const { activeTab } = useOnboardingStore();

  useEffect(() => {
    async function checkAuth() {
      try {
        // Check if we're in a Whop environment
        const isWhopEnvironment = typeof window !== 'undefined' && 
          (window.location.hostname.includes('whop.com') || 
           window.location.search.includes('whop='));
        
        if (!isWhopEnvironment) {
          // For development, allow access
          console.log('Development mode - allowing access');
          setIsAuthorized(true);
          setLoading(false);
          return;
        }

        // Get user info from Whop SDK
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        
        if (!data.isAdmin) {
          console.log('User does not have admin permissions');
          router.push('/unauthorized');
          return;
        }
        
        setIsAuthorized(true);
        setUserInfo(data.user);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/unauthorized');
      } finally {
        setLoading(false);
      }
    }
    
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a7fff] mx-auto mb-4"></div>
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect
  }

  return (
    <Layout>
      {/* Admin Panel Header */}
      <div className="bg-[#1a1a1a] border-b border-[#3a3a3a] px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Onboarding Builder</h1>
            <p className="text-sm text-gray-400">Create and manage your onboarding experience</p>
          </div>
          {userInfo && (
            <div className="text-sm text-gray-400">
              Welcome, {userInfo.username || userInfo.email || 'Admin'}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'builder' ? (
        <DndProvider backend={HTML5Backend}>
          {/* Left Sidebar - Screen Management */}
          <ScreenList />
          <Canvas />
          <ComponentEditor />
        </DndProvider>
      ) : (
        <PreviewScreen />
      )}
    </Layout>
  );
}
