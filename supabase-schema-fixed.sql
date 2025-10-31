-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create onboarding_experiences table
CREATE TABLE IF NOT EXISTS onboarding_experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  created_by TEXT, -- Whop user ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create onboarding_screens table
CREATE TABLE IF NOT EXISTS onboarding_screens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experience_id UUID NOT NULL REFERENCES onboarding_experiences(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create onboarding_components table
CREATE TABLE IF NOT EXISTS onboarding_components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  screen_id UUID NOT NULL REFERENCES onboarding_screens(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('heading', 'paragraph', 'image', 'gif', 'video', 'link')),
  content JSONB NOT NULL DEFAULT '{}',
  settings JSONB NOT NULL DEFAULT '{}',
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_experiences_company_id ON onboarding_experiences(company_id);
CREATE INDEX IF NOT EXISTS idx_experiences_published ON onboarding_experiences(is_published);
CREATE INDEX IF NOT EXISTS idx_screens_experience_id ON onboarding_screens(experience_id);
CREATE INDEX IF NOT EXISTS idx_screens_order ON onboarding_screens(experience_id, order_index);
CREATE INDEX IF NOT EXISTS idx_components_screen_id ON onboarding_components(screen_id);
CREATE INDEX IF NOT EXISTS idx_components_order ON onboarding_components(screen_id, order_index);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_experiences_updated_at ON onboarding_experiences;

-- Create trigger for updated_at
CREATE TRIGGER update_experiences_updated_at 
    BEFORE UPDATE ON onboarding_experiences 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Published experiences are viewable by everyone" ON onboarding_experiences;
DROP POLICY IF EXISTS "Users can view their company experiences" ON onboarding_experiences;
DROP POLICY IF EXISTS "Users can create experiences for their company" ON onboarding_experiences;
DROP POLICY IF EXISTS "Users can update their company experiences" ON onboarding_experiences;
DROP POLICY IF EXISTS "Users can delete their company experiences" ON onboarding_experiences;
DROP POLICY IF EXISTS "Screens are viewable with their experience" ON onboarding_screens;
DROP POLICY IF EXISTS "Users can manage screens for their company" ON onboarding_screens;
DROP POLICY IF EXISTS "Components are viewable with their screen" ON onboarding_components;
DROP POLICY IF EXISTS "Users can manage components for their company" ON onboarding_components;

-- Enable Row Level Security (RLS)
ALTER TABLE onboarding_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_screens ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_components ENABLE ROW LEVEL SECURITY;

-- Simplified RLS policies that work with anon key
-- These policies allow:
-- 1. Anyone to read published experiences (for public onboarding)
-- 2. Full access via service role key (used by API routes)

-- Allow everyone to read published experiences
CREATE POLICY "Published experiences are viewable by everyone" ON onboarding_experiences
  FOR SELECT USING (is_published = true);

-- Note: For admin operations (INSERT, UPDATE, DELETE), we use the service role key
-- in server-side API routes, which bypasses RLS. This is safe because:
-- 1. We authenticate users via Whop SDK before any database operations
-- 2. We verify company_id matches the user's company
-- 3. Service role key is only used server-side, never exposed to clients

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

