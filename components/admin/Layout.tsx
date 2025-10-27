'use client';

import { useOnboardingStore } from '@/lib/admin/store';
import { cn } from '@/lib/shared/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { activeTab, setActiveTab } = useOnboardingStore();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(true);

  useEffect(() => {
    // Fetch debug info
    const fetchDebugInfo = async () => {
      try {
        // Get cookies
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);

        setDebugInfo({
          cookies: Object.keys(cookies).length > 0 ? 'Cookies found' : 'No cookies',
          cookieKeys: Object.keys(cookies),
          timestamp: new Date().toISOString(),
          pathname: window.location.pathname,
          hasWhopToken: !!cookies['whop-token'],
        });
      } catch (error) {
        setDebugInfo({ error: String(error) });
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
                Token: {debugInfo.hasWhopToken ? '✅ Found' : '❌ Not Found'}
              </span>
              <span className="text-yellow-200">
                Cookies: {debugInfo.cookies} ({debugInfo.cookieKeys.length})
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
