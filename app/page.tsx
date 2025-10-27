'use client';

import Layout from '@/components/admin/Layout';
import ScreenList from '@/components/admin/ScreenList';
import Canvas from '@/components/admin/Canvas';
import ComponentEditor from '@/components/admin/ComponentEditor';
import PreviewScreen from '@/components/onboarding/PreviewScreen';
import { useOnboardingStore } from '@/lib/admin/store';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function Page() {
  const { activeTab } = useOnboardingStore();

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
