import { redirect } from "next/navigation";

/**
 * Admin Builder Page
 * 
 * This page redirects users to the onboarding builder.
 */
export default function AdminBuilderPage() {
  // Redirect to the builder page
  redirect("/admin/builder");
}
