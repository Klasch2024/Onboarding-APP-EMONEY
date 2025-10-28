'use client';

import { useOnboardingStore } from '@/lib/admin/store';
import { cn } from '@/lib/shared/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  accessLevel?: 'admin' | 'customer' | 'no_access';
  userId?: string;
}

export default function Layout({ children, accessLevel = 'customer', userId }: LayoutProps) {
  const { activeTab, setActiveTab } = useOnboardingStore();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(true);
  const isAdmin = accessLevel === 'admin';

  useEffect(() => {
    // Fetch debug info from API
    const fetchDebugInfo = async () => {
      try {
        const response = await fetch('/api/user');
        const userData = await response.json();
        
        // Also fetch detailed debug info
        const debugResponse = await fetch('/api/debug');
        const debugData = await debugResponse.json();
        
        setDebugInfo({
          ...userData,
          debugData,
          timestamp: new Date().toISOString(),
          pathname: window.location.pathname,
        });
      } catch (error) {
        setDebugInfo({ 
          error: String(error),
          token: 'API Error',
          isAdmin: false,
          accessLevel: 'no_access'
        });
      }
    };

    fetchDebugInfo();
  }, []);

  const tabs = [
    { id: 'preview', label: 'Onboarding Preview' },
    { id: 'builder', label: 'Onboarding Builder' }
  ] as const;

  return (
    <div className="min-h-screen bg-[#111111] text-white">
              {/* Debug Window */}
              {showDebug && debugInfo && (
                <div className="bg-yellow-900 border-b border-yellow-700 px-6 py-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="font-semibold text-yellow-300">🔍 DEBUG INFO:</span>
                      <span className="text-yellow-200">
                        Token: {debugInfo.token === 'Found' ? '✅ Found' : '❌ Not Found'}
                      </span>
                      <span className="text-yellow-200">
                        User: {debugInfo.userId ? `✅ ${debugInfo.userId}` : '❌ No User'}
                      </span>
                      <span className="text-yellow-200">
                        Admin: {debugInfo.isAdmin ? '✅ Yes' : '❌ No'}
                      </span>
                      <span className="text-yellow-200">
                        Access: {debugInfo.accessLevel || 'unknown'}
                      </span>
                      <span className="text-yellow-200">Path: {debugInfo.pathname}</span>
                      <span className="text-yellow-200">Time: {new Date(debugInfo.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <button
                      onClick={() => setShowDebug(false)}
                      className="text-yellow-300 hover:text-yellow-100"
                    >
                      ✕ Close
                    </button>
                  </div>
                  {debugInfo.debugData && (
                    <div className="mt-2 text-yellow-200">
                      <div className="text-xs">
                        <strong>Tokens:</strong> {JSON.stringify(debugInfo.debugData.tokens)}
                      </div>
                      <div className="text-xs">
                        <strong>Cookies:</strong> {Object.keys(debugInfo.debugData.allCookies).length} found
                      </div>
                    </div>
                  )}
                </div>
              )}

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
