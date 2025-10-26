'use client';

import Layout from '@/components/Layout';
import ScreenList from '@/components/ScreenList';
import Canvas from '@/components/Canvas';
import ComponentEditor from '@/components/ComponentEditor';
import PreviewScreen from '@/components/PreviewScreen';
import { useOnboardingStore } from '@/lib/store';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function BuilderClient() {
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
