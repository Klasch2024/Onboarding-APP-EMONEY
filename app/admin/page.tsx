import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/shared/auth";

/**
 * Admin Builder Page
 * 
 * This page redirects users to the onboarding builder.
 * Only admin users can access this page.
 */
export default async function AdminBuilderPage() {
  // Check if user is authenticated and has admin access
  const user = await getCurrentUser();
  
  if (!user || !user.isAdmin) {
    // Redirect non-admin users to onboarding discover page
    redirect("/onboarding/discover");
  }

  // Redirect to the builder page
  redirect("/admin/builder");
}
