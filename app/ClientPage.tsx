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

interface ClientPageProps {
  accessLevel?: 'admin' | 'customer' | 'no_access';
  userId?: string;
}

export default function ClientPage({ accessLevel = 'customer', userId }: ClientPageProps) {
  const { activeTab, setActiveTab } = useOnboardingStore();
  const isAdmin = accessLevel === 'admin';

  // Ensure non-admin users can only see preview
  useEffect(() => {
    if (!isAdmin && activeTab === 'builder') {
      setActiveTab('preview');
    }
  }, [isAdmin, activeTab, setActiveTab]);

  return (
    <Layout accessLevel={accessLevel} userId={userId}>
      {/* Main Content Area */}
      {/* Admin users can see builder and preview */}
      {/* Customer users can only see preview */}
      {isAdmin && activeTab === 'builder' ? (
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
