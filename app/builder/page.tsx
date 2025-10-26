import { redirect } from 'next/navigation';
import { isUserAdmin } from '@/lib/auth';
import BuilderClient from '@/components/BuilderClient';

/**
 * Builder Page - Admin Only
 * 
 * This page is only accessible to admins. Regular members
 * will be redirected to the onboarding view.
 */
export default async function BuilderPage() {
  // Check if user is admin
  const isAdmin = await isUserAdmin();

  // If not admin, redirect to onboarding view
  if (!isAdmin) {
    redirect('/onboarding');
  }

  // If admin, show the builder interface
  return <BuilderClient />;
}
