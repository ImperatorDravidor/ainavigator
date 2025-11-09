-- Demo Schema for AI Navigator Summit Demo
-- This schema supports company-specific demo logins with their data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies table for demo clients
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Demo users/auth for summit login
CREATE TABLE demo_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL, -- Simple hash for demo purposes
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'viewer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Respondents table (matches sentiment_demo.csv structure)
CREATE TABLE respondents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  respondent_id TEXT NOT NULL, -- Original RespondentID from CSV
  region TEXT,
  department TEXT,
  employment_type TEXT,
  age TEXT,
  user_language TEXT,
  -- Sentiment scores (1-25)
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

-- Indexes for performance
CREATE INDEX idx_respondents_company ON respondents(company_id);
CREATE INDEX idx_respondents_region ON respondents(region);
CREATE INDEX idx_respondents_department ON respondents(department);
CREATE INDEX idx_demo_users_email ON demo_users(email);
CREATE INDEX idx_demo_users_company ON demo_users(company_id);

-- Row Level Security (RLS) policies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE respondents ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own company's data
CREATE POLICY "Users can view their company"
  ON companies FOR SELECT
  USING (id IN (SELECT company_id FROM demo_users WHERE email = current_setting('app.user_email', true)));

CREATE POLICY "Users can view respondents from their company"
  ON respondents FOR SELECT
  USING (company_id IN (SELECT company_id FROM demo_users WHERE email = current_setting('app.user_email', true)));

-- Insert demo companies
INSERT INTO companies (name, display_name) VALUES
  ('acme-wealth', 'Acme Wealth Advisors');

-- Insert demo users (password is 'demo123' - you should hash this properly)
-- For demo purposes, using plain text - replace with proper bcrypt/argon2 hashing
INSERT INTO demo_users (email, password_hash, company_id, full_name, role) VALUES
  ('demo@acmewealth.com', 'demo123', (SELECT id FROM companies WHERE name = 'acme-wealth'), 'Sarah Morgan', 'admin'),
  ('analyst@acmewealth.com', 'demo123', (SELECT id FROM companies WHERE name = 'acme-wealth'), 'Michael Chen', 'admin'),
  ('executive@acmewealth.com', 'demo123', (SELECT id FROM companies WHERE name = 'acme-wealth'), 'Emma Rodriguez', 'admin');


