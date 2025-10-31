# Supabase Setup Guide

## The Problem

The RLS (Row Level Security) policies in your Supabase database are blocking database operations because they reference `current_setting('app.current_company_id')`, which isn't being set by the API.

## The Solution

We have two options. **I recommend Option 1** for simplicity and security.

### Option 1: Use Service Role Key (Recommended)

The service role key bypasses RLS, which is safe because:
- We authenticate users via Whop SDK before any database operations
- We verify `company_id` matches in our API code
- The service role key is only used server-side, never exposed to clients

#### Steps:

1. **Get your Service Role Key from Supabase:**
   - Go to your Supabase project dashboard: https://supabase.com/dashboard/project/pegmaowbdeesmqfvxzuc
   - Navigate to **Settings** → **API**
   - Under "Project API keys", find the **`service_role`** key (⚠️ keep this secret!)
   - Copy the key

2. **Add it to your environment variables:**
   - Add `SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here` to your `.env.local` file
   - Also add it to your Vercel environment variables if deploying

3. **Update your RLS policies in Supabase:**
   - Go to your Supabase SQL Editor
   - Run the SQL from `supabase-schema-fixed.sql` to update your policies
   - This will simplify the policies to only allow reading published experiences

That's it! The API will now use the service role key for all operations.

### Option 2: Fix RLS Policies (More Complex)

If you prefer to keep RLS active for all operations, you would need to:
1. Set the `current_setting` variable before each query
2. Update all API routes to set this variable
3. This is more complex and not recommended for this use case

## Running the Fixed Schema

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy and paste the contents of `supabase-schema-fixed.sql`
4. Click **Run** to execute the SQL

This will:
- Drop the problematic policies
- Create simplified policies that only allow reading published experiences
- Keep RLS enabled for security
- Allow admin operations via service role key

## Environment Variables Checklist

Make sure you have these in your `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here  # ⬅️ ADD THIS

# Whop
NEXT_PUBLIC_WHOP_APP_ID=your_app_id
WHOP_API_KEY=your_api_key
NEXT_PUBLIC_WHOP_COMPANY_ID=your_company_id
```

## Troubleshooting

**Still getting errors?**
- Verify your service role key is correct (no extra spaces)
- Make sure you've run the fixed schema SQL
- Check the browser console and server logs for specific error messages
- The API will log detailed error messages including Supabase error codes

