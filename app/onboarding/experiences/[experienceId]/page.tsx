import { redirect } from 'next/navigation';
import { getCurrentUser, checkExperienceAccess } from "@/lib/shared/auth";

/**
 * Experience Page Component
 * 
 * This page shows the onboarding experience for users.
 * Users must have access to the specific experience to view it.
 */
export default async function ExperiencePage({
   params,
}: {
   params: Promise<{ experienceId: string }>;
}) {
   const { experienceId } = await params;
   
   // Check if user is authenticated
   const user = await getCurrentUser();
   
   if (!user) {
      // No user - redirect to discover page
      redirect('/onboarding/discover');
   }

   // Check if user has access to this specific experience
   const accessCheck = await checkExperienceAccess(user.userId, experienceId);
   
   if (!accessCheck.hasAccess) {
      // User doesn't have access to this experience
      redirect('/onboarding/discover');
   }

   // For now, redirect to admin builder (you can implement actual experience view later)
   // In a real implementation, you would render the actual onboarding experience here
   redirect('/admin/builder');
}

