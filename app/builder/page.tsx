import { redirect } from 'next/navigation';

/**
 * Builder Page Component
 * 
 * This page redirects to the dashboard with role-based access control.
 * The actual builder functionality is now handled by the dashboard route
 * which includes proper access control.
 */
export default function BuilderPage() {
  // Redirect to dashboard for proper access control
  // The dashboard route will handle role-based access
  redirect('/dashboard/default');
}
