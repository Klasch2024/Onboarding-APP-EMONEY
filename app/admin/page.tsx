'use client';

import Layout from '@/components/Layout';
import ScreenList from '@/components/ScreenList';
import Canvas from '@/components/Canvas';
import ComponentEditor from '@/components/ComponentEditor';
import PreviewScreen from '@/components/PreviewScreen';
import { useOnboardingStore } from '@/lib/store';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

/**
 * Admin Dashboard Page
 * 
 * This page is only accessible to admins and provides the full
 * onboarding builder interface for creating and editing onboarding flows.
 */
export default function AdminDashboard() {
  const { activeTab } = useOnboardingStore();

  return (
    <Layout>
      {/* Admin Header */}
      <div className="bg-[#1a1a1a] border-b border-[#3a3a3a] p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">
            Admin Dashboard - Onboarding Builder
          </h1>
          <div className="text-sm text-[#888888]">
            Create and edit onboarding flows for your community
          </div>
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
