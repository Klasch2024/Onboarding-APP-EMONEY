import { redirect } from "next/navigation";

/**
 * Admin Builder Page
 * 
 * This page redirects users to the onboarding builder.
 * The onboarding builder is the main interface for creating
 * and customizing onboarding flows.
 */
export default async function AdminBuilderPage() {
  // Redirect to the builder page
  redirect("/builder");
}
