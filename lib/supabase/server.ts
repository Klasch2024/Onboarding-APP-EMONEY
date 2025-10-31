import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client for server-side operations.
 * Uses the service role key if available (bypasses RLS), otherwise falls back to anon key.
 * 
 * For server-side API routes where we handle authentication via Whop SDK,
 * using the service role key is safe and recommended.
 */
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  
  // Prefer service role key for server-side operations (bypasses RLS)
  // This is safe because we're already handling auth via Whop SDK
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (serviceRoleKey) {
    return createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }
  
  // Fallback to anon key if service role key is not available
  return createClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
