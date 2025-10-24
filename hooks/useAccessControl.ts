'use client';

import { useState, useEffect } from 'react';

interface AccessState {
  isAdmin: boolean;
  hasAccess: boolean;
  loading: boolean;
  error?: string;
}

/**
 * Client-side hook for managing access control state
 * This hook should be used in client components to check user permissions
 */
export function useAccessControl(initialIsAdmin: boolean = false) {
  const [accessState, setAccessState] = useState<AccessState>({
    isAdmin: initialIsAdmin,
    hasAccess: initialIsAdmin,
    loading: false
  });

  // Update access state when props change
  useEffect(() => {
    setAccessState(prev => ({
      ...prev,
      isAdmin: initialIsAdmin,
      hasAccess: initialIsAdmin
    }));
  }, [initialIsAdmin]);

  const checkAccess = async (companyId: string) => {
    setAccessState(prev => ({ ...prev, loading: true }));
    
    try {
      // This would typically make an API call to verify access
      // For now, we'll use the server-side determined value
      const response = await fetch(`/api/access/check?companyId=${companyId}`);
      
      if (!response.ok) {
        throw new Error('Access check failed');
      }
      
      const data = await response.json();
      
      setAccessState({
        isAdmin: data.accessLevel === 'admin',
        hasAccess: data.hasAccess,
        loading: false
      });
    } catch (error) {
      setAccessState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Access check failed'
      }));
    }
  };

  return {
    ...accessState,
    checkAccess
  };
}
