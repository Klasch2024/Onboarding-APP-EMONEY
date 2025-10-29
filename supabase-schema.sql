-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create onboarding_experiences table
CREATE TABLE onboarding_experiences (
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
CREATE TABLE onboarding_screens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experience_id UUID NOT NULL REFERENCES onboarding_experiences(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create onboarding_components table
CREATE TABLE onboarding_components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  screen_id UUID NOT NULL REFERENCES onboarding_screens(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('heading', 'paragraph', 'image', 'gif', 'video', 'link')),
  content JSONB NOT NULL DEFAULT '{}',
  settings JSONB NOT NULL DEFAULT '{}',
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_experiences_company_id ON onboarding_experiences(company_id);
CREATE INDEX idx_experiences_published ON onboarding_experiences(is_published);
CREATE INDEX idx_screens_experience_id ON onboarding_screens(experience_id);
CREATE INDEX idx_screens_order ON onboarding_screens(experience_id, order_index);
CREATE INDEX idx_components_screen_id ON onboarding_components(screen_id);
CREATE INDEX idx_components_order ON onboarding_components(screen_id, order_index);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_experiences_updated_at 
    BEFORE UPDATE ON onboarding_experiences 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE onboarding_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_screens ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_components ENABLE ROW LEVEL SECURITY;

-- Create policies for onboarding_experiences
-- Allow all authenticated users to read published experiences
CREATE POLICY "Published experiences are viewable by everyone" ON onboarding_experiences
  FOR SELECT USING (is_published = true);

-- Allow users to read their own company's experiences
CREATE POLICY "Users can view their company experiences" ON onboarding_experiences
  FOR SELECT USING (company_id = current_setting('app.current_company_id', true));

-- Allow users to create experiences for their company
CREATE POLICY "Users can create experiences for their company" ON onboarding_experiences
  FOR INSERT WITH CHECK (company_id = current_setting('app.current_company_id', true));

-- Allow users to update experiences for their company
CREATE POLICY "Users can update their company experiences" ON onboarding_experiences
  FOR UPDATE USING (company_id = current_setting('app.current_company_id', true));

-- Allow users to delete experiences for their company
CREATE POLICY "Users can delete their company experiences" ON onboarding_experiences
  FOR DELETE USING (company_id = current_setting('app.current_company_id', true));

-- Create policies for onboarding_screens
CREATE POLICY "Screens are viewable with their experience" ON onboarding_screens
  FOR SELECT USING (
    experience_id IN (
      SELECT id FROM onboarding_experiences 
      WHERE is_published = true 
      OR company_id = current_setting('app.current_company_id', true)
    )
  );

CREATE POLICY "Users can manage screens for their company" ON onboarding_screens
  FOR ALL USING (
    experience_id IN (
      SELECT id FROM onboarding_experiences 
      WHERE company_id = current_setting('app.current_company_id', true)
    )
  );

-- Create policies for onboarding_components
CREATE POLICY "Components are viewable with their screen" ON onboarding_components
  FOR SELECT USING (
    screen_id IN (
      SELECT s.id FROM onboarding_screens s
      JOIN onboarding_experiences e ON s.experience_id = e.id
      WHERE e.is_published = true 
      OR e.company_id = current_setting('app.current_company_id', true)
    )
  );

CREATE POLICY "Users can manage components for their company" ON onboarding_components
  FOR ALL USING (
    screen_id IN (
      SELECT s.id FROM onboarding_screens s
      JOIN onboarding_experiences e ON s.experience_id = e.id
      WHERE e.company_id = current_setting('app.current_company_id', true)
    )
  );
