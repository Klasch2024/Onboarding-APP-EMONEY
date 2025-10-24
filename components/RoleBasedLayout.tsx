'use client';

import { useState, useEffect } from 'react';
import Layout from './Layout';
import ScreenList from './ScreenList';
import Canvas from './Canvas';
import ComponentEditor from './ComponentEditor';
import PreviewScreen from './PreviewScreen';
import { useOnboardingStore } from '@/lib/store';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface RoleBasedLayoutProps {
  isAdmin: boolean;
  companyId: string;
}

export default function RoleBasedLayout({ isAdmin, companyId }: RoleBasedLayoutProps) {
  const { activeTab, setActiveTab } = useOnboardingStore();
  const [accessLevel, setAccessLevel] = useState<'admin' | 'member'>('member');

  useEffect(() => {
    setAccessLevel(isAdmin ? 'admin' : 'member');
    
    // For members, always show preview mode
    if (!isAdmin) {
      setActiveTab('preview');
    }
  }, [isAdmin, setActiveTab]);

  // For members: Show only the onboarding preview (read-only)
  if (accessLevel === 'member') {
    return (
      <Layout>
        <div className="w-full h-screen bg-[#111111] flex flex-col">
          {/* Member View - Read-only onboarding */}
          <div className="flex-1 overflow-hidden">
            <PreviewScreen />
          </div>
          
          {/* Optional: Add a subtle indicator that this is member view */}
          <div className="bg-[#2a2a2a] border-t border-[#3a3a3a] px-4 py-2">
            <p className="text-xs text-[#888888] text-center">
              Member View - Contact admin for editing access
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // For admins: Show the full builder interface with all controls
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
