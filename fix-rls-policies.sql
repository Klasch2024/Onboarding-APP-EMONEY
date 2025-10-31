-- Fix RLS Policies for Onboarding App
-- This script removes the problematic policies and creates simplified ones

-- Step 1: Drop all existing problematic policies
DROP POLICY IF EXISTS "Published experiences are viewable by everyone" ON onboarding_experiences;
DROP POLICY IF EXISTS "Users can view their company experiences" ON onboarding_experiences;
DROP POLICY IF EXISTS "Users can create experiences for their company" ON onboarding_experiences;
DROP POLICY IF EXISTS "Users can update their company experiences" ON onboarding_experiences;
DROP POLICY IF EXISTS "Users can delete their company experiences" ON onboarding_experiences;
DROP POLICY IF EXISTS "Screens are viewable with their experience" ON onboarding_screens;
DROP POLICY IF EXISTS "Users can manage screens for their company" ON onboarding_screens;
DROP POLICY IF EXISTS "Components are viewable with their screen" ON onboarding_components;
DROP POLICY IF EXISTS "Users can manage components for their company" ON onboarding_components;

-- Step 2: Create simplified policies that work with service role key
-- These policies only allow reading published experiences
-- Admin operations (INSERT, UPDATE, DELETE) will use the service role key which bypasses RLS

-- Allow everyone to read published experiences
CREATE POLICY "Published experiences are viewable by everyone" ON onboarding_experiences
  FOR SELECT USING (is_published = true);

-- Allow reading screens for published experiences
CREATE POLICY "Screens for published experiences are viewable" ON onboarding_screens
  FOR SELECT USING (
    experience_id IN (
      SELECT id FROM onboarding_experiences WHERE is_published = true
    )
  );

-- Allow reading components for published experiences
CREATE POLICY "Components for published experiences are viewable" ON onboarding_components
  FOR SELECT USING (
    screen_id IN (
      SELECT s.id FROM onboarding_screens s
      JOIN onboarding_experiences e ON s.experience_id = e.id
      WHERE e.is_published = true
    )
  );

-- Note: INSERT, UPDATE, and DELETE operations will be handled by the service role key
-- in your API routes, which bypasses RLS. This is safe because:
-- 1. You authenticate users via Whop SDK before any database operations
-- 2. You verify company_id matches in your API code
-- 3. Service role key is only used server-side, never exposed to clients

