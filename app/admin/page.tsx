'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is admin and redirect to builder
    async function checkAdmin() {
      try {
        // For now, redirect to builder
        // In a real implementation, you would check user permissions
        router.push('/builder');
      } catch (error) {
        console.error('Admin check failed:', error);
        router.push('/unauthorized');
      } finally {
        setLoading(false);
      }
    }
    
    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a7fff] mx-auto mb-4"></div>
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  return null; // Will redirect
}
