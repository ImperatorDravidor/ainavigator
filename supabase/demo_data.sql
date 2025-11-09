-- Insert demo companies
INSERT INTO public.companies (id, name, display_name, logo_url) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'acme-wealth', 'Acme Wealth Advisors', null)
ON CONFLICT (name) DO NOTHING;

-- Insert demo users (password is "demo123" for all)
INSERT INTO public.demo_users (email, password_hash, company_id, full_name, role) VALUES
  ('demo@acmewealth.com', 'demo123', '550e8400-e29b-41d4-a716-446655440001', 'Sarah Morgan', 'Chief Innovation Officer'),
  ('analyst@acmewealth.com', 'demo123', '550e8400-e29b-41d4-a716-446655440001', 'Michael Chen', 'Senior Analyst'),
  ('executive@acmewealth.com', 'demo123', '550e8400-e29b-41d4-a716-446655440001', 'Emma Rodriguez', 'Chief Strategy Officer')
ON CONFLICT (email) DO NOTHING;

-- Insert sample respondent data for demo (optional - for testing dashboard)
INSERT INTO public.respondents (
  company_id, respondent_id, region, department, employment_type, age, user_language,
  sentiment_1, sentiment_2, sentiment_3, sentiment_4, sentiment_5, 
  sentiment_6, sentiment_7, sentiment_8, sentiment_9, sentiment_10,
  sentiment_11, sentiment_12, sentiment_13, sentiment_14, sentiment_15,
  sentiment_16, sentiment_17, sentiment_18, sentiment_19, sentiment_20,
  sentiment_21, sentiment_22, sentiment_23, sentiment_24, sentiment_25
) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'RESP001', 'North America', 'Engineering', 'Full-time', '30-39', 'en',
   4.5, 3.8, 4.2, 3.5, 4.0, 3.9, 4.1, 3.7, 4.3, 3.6,
   4.4, 3.8, 4.0, 3.9, 4.2, 3.7, 4.1, 3.8, 4.0, 3.9,
   4.3, 3.6, 4.2, 3.8, 4.1),
  ('550e8400-e29b-41d4-a716-446655440001', 'RESP002', 'Europe', 'Marketing', 'Full-time', '25-29', 'en',
   3.5, 3.2, 3.8, 3.1, 3.6, 3.4, 3.7, 3.3, 3.9, 3.2,
   3.8, 3.4, 3.6, 3.5, 3.7, 3.3, 3.8, 3.4, 3.6, 3.5,
   3.7, 3.2, 3.8, 3.4, 3.6);

