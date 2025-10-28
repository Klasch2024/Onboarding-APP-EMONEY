'use client';

import { useOnboardingStore } from '@/lib/admin/store';
import { cn } from '@/lib/shared/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  accessLevel?: 'admin' | 'customer' | 'no_access';
  userId?: string;
}

export default function Layout({ children, accessLevel = 'customer', userId }: LayoutProps) {
  const { activeTab, setActiveTab } = useOnboardingStore();
  const isAdmin = accessLevel === 'admin';

  const tabs = isAdmin 
    ? [
        { id: 'preview' as const, label: 'Onboarding Preview' },
        { id: 'builder' as const, label: 'Onboarding Builder' }
      ]
    : [
        { id: 'preview' as const, label: 'Onboarding Preview' }
      ];

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      {/* Top Navigation Bar */}
      <div className="bg-[#111111] border-b border-[#2a2a2a] px-6 py-4">
        <div className="flex items-center space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'relative px-4 py-2 text-sm font-medium transition-all duration-200',
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-[#888888] hover:text-white'
              )}
            >
              {tab.label}
              <AnimatePresence>
                {activeTab === tab.id && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    exit={{ width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4a7fff]"
                  />
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <motion.div 
        className="flex h-[calc(100vh-73px)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
