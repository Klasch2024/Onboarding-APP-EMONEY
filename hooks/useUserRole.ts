'use client';

import { useOnboardingStore } from '@/lib/store';
import { useEffect, useState } from 'react';

// Function to detect user role from Whop context
function detectWhopUser() {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check for development parameters first
    const userType = urlParams.get('user');
    if (userType === 'member') {
      return {
        id: 'member-123',
        role: 'member' as const,
        name: 'Community Member',
        email: 'member@example.com'
      };
    }
    
    // Force admin mode for testing
    if (userType === 'admin') {
      return {
        id: 'force-admin',
        role: 'admin' as const,
        name: 'Force Admin',
        email: 'admin@test.com'
      };
    }
    
    // Check for admin override in localStorage
    const adminOverride = localStorage.getItem('admin-override');
    if (adminOverride === 'true') {
      return {
        id: 'local-admin',
        role: 'admin' as const,
        name: 'Local Admin Override',
        email: 'admin@local.com'
      };
    }
    
    // PRIORITY 1: Check for Whop tokens (most reliable indicator)
    const hasWhopToken = window.location.search.includes('whop-dev-user-token') || 
                        window.location.search.includes('whop-user-token');
    
    if (hasWhopToken) {
      return {
        id: 'whop-token-admin',
        role: 'admin' as const,
        name: 'Whop Token Admin',
        email: 'admin@whop.com'
      };
    }
    
    // PRIORITY 2: Check for Whop-specific parameters or context
    const isWhopApp = urlParams.get('whop') || 
                     window.location.hostname.includes('whop') ||
                     window.location.hostname.includes('localhost:3000') || // Development
                     window.location.hostname.includes('vercel.app') || // Vercel deployment
                     window.location.hostname.includes('netlify.app'); // Netlify deployment
    
    // If user can install/access the app, they're an admin
    // This includes Whop app installation context
    if (isWhopApp) {
      return {
        id: 'whop-admin',
        role: 'admin' as const,
        name: 'Whop Admin',
        email: 'admin@whop.com'
      };
    }
    
    // PRIORITY 3: Default to admin for development/testing
    // This ensures that when someone installs the app, they get admin access
    return {
      id: 'admin-123',
      role: 'admin' as const,
      name: 'Community Admin',
      email: 'admin@example.com'
    };
  }
  
  return null;
}

export function useUserRole() {
  const { user, setUser } = useOnboardingStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Always re-detect user to ensure we have the latest role
    const detectedUser = detectWhopUser();
    console.log('🔍 User Detection Debug:');
    console.log('- URL:', window.location.href);
    console.log('- Hostname:', window.location.hostname);
    console.log('- Search params:', window.location.search);
    console.log('- Current user:', user);
    console.log('- Detected user:', detectedUser);
    
    // Update user if different or if no user set
    if (!user || (detectedUser && detectedUser.id !== user.id)) {
      if (detectedUser) {
        console.log('✅ Setting new user:', detectedUser);
        setUser(detectedUser);
      }
    }
    
    setIsLoading(false);
    
    // Add global function for manual admin override
    (window as any).forceAdmin = () => {
      localStorage.setItem('admin-override', 'true');
      window.location.reload();
    };
    
    (window as any).forceMember = () => {
      localStorage.removeItem('admin-override');
      window.location.reload();
    };
  }, [user, setUser]);

  return {
    user,
    isAdmin: user?.role === 'admin',
    isMember: user?.role === 'member',
    isLoading
  };
}
