'use client';

import Layout from '@/components/admin/Layout';
import ScreenList from '@/components/admin/ScreenList';
import Canvas from '@/components/admin/Canvas';
import ComponentEditor from '@/components/admin/ComponentEditor';
import PreviewScreen from '@/components/onboarding/PreviewScreen';
import { useOnboardingStore } from '@/lib/admin/store';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BuilderPage() {
  const { activeTab } = useOnboardingStore();
  const router = useRouter();

  // Client-side access control (additional layer)
  useEffect(() => {
    // This is a fallback - the main access control is handled by middleware
    // and server-side checks in the admin page
    const checkAccess = async () => {
      try {
        // You could add additional client-side checks here if needed
        // For now, we rely on the middleware and server-side checks
      } catch (error) {
        console.error('Access check failed:', error);
        router.push('/onboarding/discover');
      }
    };

    checkAccess();
  }, [router]);

  return (
    <Layout>
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
