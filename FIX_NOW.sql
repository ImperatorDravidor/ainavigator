-- Direct fix: Create assessment period for your company
-- Run this once: psql YOUR_DATABASE_URL -f FIX_NOW.sql

-- Update existing data to baseline
UPDATE respondents
SET 
  survey_wave = 'oct-2024-baseline',
  assessment_date = '2024-10-15'
WHERE company_id = '550e8400-e29b-41d4-a716-446655440001'
  AND (survey_wave IS NULL OR survey_wave = 'baseline' OR survey_wave = '');

UPDATE capability_scores
SET
  survey_wave = 'oct-2024-baseline',
  assessment_date = '2024-10-15'
WHERE company_id = '550e8400-e29b-41d4-a716-446655440001'
  AND (survey_wave IS NULL OR survey_wave = 'baseline' OR survey_wave = '');

-- Create the assessment period
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
)
VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'oct-2024-baseline',
  '2024-10-15',
  'Oct 2024 Baseline',
  'Initial assessment establishing baseline metrics. Key challenges: low trust in AI autonomy, limited strategic alignment, gaps in talent readiness, and nascent innovation capability.',
  ARRAY[]::TEXT[],
  'active',
  (SELECT COUNT(DISTINCT respondent_id) FROM respondents WHERE company_id = '550e8400-e29b-41d4-a716-446655440001' AND survey_wave = 'oct-2024-baseline'),
  (SELECT COUNT(DISTINCT respondent_id) FROM capability_scores WHERE company_id = '550e8400-e29b-41d4-a716-446655440001' AND survey_wave = 'oct-2024-baseline')
)
ON CONFLICT DO NOTHING;

-- Verify
SELECT 
  id, 
  name, 
  survey_wave, 
  assessment_date, 
  sentiment_respondents, 
  capability_respondents 
FROM assessment_periods 
WHERE company_id = '550e8400-e29b-41d4-a716-446655440001';

