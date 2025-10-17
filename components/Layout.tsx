'use client';

import { useOnboardingStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { activeTab, setActiveTab, publishOnboarding, isAdmin } = useOnboardingStore();

  const tabs = [
    { id: 'preview', label: 'Onboarding Preview' },
    { id: 'builder', label: 'Onboarding Builder' }
  ] as const;

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      {/* Top Navigation Bar */}
      <div className="bg-[#111111] border-b border-[#2a2a2a] px-6 py-4">
        <div className="flex items-center justify-between">
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
          
          {/* Publish Button for Admins */}
          {isAdmin && (
            <button
              onClick={publishOnboarding}
              className="bg-[#4a7fff] hover:bg-[#5a8fff] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Publish Onboarding
            </button>
          )}
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
