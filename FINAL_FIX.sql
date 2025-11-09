-- FINAL FIX - Direct insert with correct array syntax

-- Clean up
DELETE FROM assessment_periods WHERE company_id = '550e8400-e29b-41d4-a716-446655440001';

-- Update all data to baseline
UPDATE respondents SET survey_wave = 'oct-2024-baseline', assessment_date = '2024-10-15' WHERE company_id = '550e8400-e29b-41d4-a716-446655440001';
UPDATE capability_scores SET survey_wave = 'oct-2024-baseline', assessment_date = '2024-10-15' WHERE company_id = '550e8400-e29b-41d4-a716-446655440001';

-- Insert period with TEXT[] array syntax
INSERT INTO assessment_periods (
  company_id,
  survey_wave,
  assessment_date,
  name,
  description,
  interventions_applied,
  status,
  sentiment_respondents,
  capability_respondents
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'oct-2024-baseline',
  '2024-10-15'::date,
  'Oct 2024 Baseline',
  'Initial baseline assessment',
  ARRAY[]::text[],
  'active',
  1000,
  1000
);

-- Verify
SELECT id, name, survey_wave, assessment_date, sentiment_respondents FROM assessment_periods;

