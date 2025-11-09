-- ============================================================================
-- AI Navigator - Complete Demo Setup
-- Run this entire file in Supabase SQL Editor
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: companies
-- Stores demo client organizations
-- ============================================================================
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: demo_users  
-- Demo authentication accounts for summit
-- ============================================================================
CREATE TABLE IF NOT EXISTS demo_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'viewer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: respondents
-- Sentiment survey responses (matches sentiment_demo.csv)
-- ============================================================================
CREATE TABLE IF NOT EXISTS respondents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  respondent_id TEXT NOT NULL,
  region TEXT,
  department TEXT,
  employment_type TEXT,
  age TEXT,
  user_language TEXT,
  -- 25 sentiment scores
  sentiment_1 DECIMAL(5,2),
  sentiment_2 DECIMAL(5,2),
  sentiment_3 DECIMAL(5,2),
  sentiment_4 DECIMAL(5,2),
  sentiment_5 DECIMAL(5,2),
  sentiment_6 DECIMAL(5,2),
  sentiment_7 DECIMAL(5,2),
  sentiment_8 DECIMAL(5,2),
  sentiment_9 DECIMAL(5,2),
  sentiment_10 DECIMAL(5,2),
  sentiment_11 DECIMAL(5,2),
  sentiment_12 DECIMAL(5,2),
  sentiment_13 DECIMAL(5,2),
  sentiment_14 DECIMAL(5,2),
  sentiment_15 DECIMAL(5,2),
  sentiment_16 DECIMAL(5,2),
  sentiment_17 DECIMAL(5,2),
  sentiment_18 DECIMAL(5,2),
  sentiment_19 DECIMAL(5,2),
  sentiment_20 DECIMAL(5,2),
  sentiment_21 DECIMAL(5,2),
  sentiment_22 DECIMAL(5,2),
  sentiment_23 DECIMAL(5,2),
  sentiment_24 DECIMAL(5,2),
  sentiment_25 DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, respondent_id)
);

-- ============================================================================
-- INDEXES for performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_respondents_company ON respondents(company_id);
CREATE INDEX IF NOT EXISTS idx_respondents_region ON respondents(region);
CREATE INDEX IF NOT EXISTS idx_respondents_department ON respondents(department);
CREATE INDEX IF NOT EXISTS idx_demo_users_email ON demo_users(email);
CREATE INDEX IF NOT EXISTS idx_demo_users_company ON demo_users(company_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE respondents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their company" ON companies;
DROP POLICY IF EXISTS "Users can view respondents from their company" ON respondents;

-- Policy: Users can only see their own company
CREATE POLICY "Users can view their company"
  ON companies FOR SELECT
  USING (id IN (SELECT company_id FROM demo_users WHERE email = current_setting('app.user_email', true)));

-- Policy: Users can only view respondents from their company
CREATE POLICY "Users can view respondents from their company"
  ON respondents FOR SELECT
  USING (company_id IN (SELECT company_id FROM demo_users WHERE email = current_setting('app.user_email', true)));

-- ============================================================================
-- SEED DATA: Demo Companies
-- ============================================================================
INSERT INTO companies (name, display_name) VALUES
  ('acme-wealth', 'Acme Wealth Advisors')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- SEED DATA: Demo User Accounts
-- Password: demo123 (plaintext for demo - replace with proper hashing in prod)
-- ============================================================================
INSERT INTO demo_users (email, password_hash, company_id, full_name, role) VALUES
  ('demo@acmewealth.com', 'demo123', (SELECT id FROM companies WHERE name = 'acme-wealth'), 'Sarah Morgan', 'admin'),
  ('analyst@acmewealth.com', 'demo123', (SELECT id FROM companies WHERE name = 'acme-wealth'), 'Michael Chen', 'admin'),
  ('executive@acmewealth.com', 'demo123', (SELECT id FROM companies WHERE name = 'acme-wealth'), 'Emma Rodriguez', 'admin')
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES
-- Run these to verify setup
-- ============================================================================

-- Should show 3 companies
SELECT 'Companies Created:' as status, COUNT(*) as count FROM companies;
SELECT * FROM companies ORDER BY name;

-- Should show 3 demo users
SELECT 'Demo Users Created:' as status, COUNT(*) as count FROM demo_users;
SELECT email, full_name, role FROM demo_users ORDER BY email;

-- Check respondent count (will be 0 until you import CSV)
SELECT 'Respondents Loaded:' as status, COUNT(*) as count FROM respondents;

-- ============================================================================
-- NEXT STEPS:
-- 1. Run: npm install
-- 2. Add .env.local with your Supabase credentials
-- 3. Run: npm run import-demo-data
-- 4. Or manually import CSV via Supabase dashboard
-- ============================================================================


