-- Step 1: Check if company exists
SELECT id, name, display_name FROM companies WHERE id = '550e8400-e29b-41d4-a716-446655440001';

-- Step 2: Check existing assessment_periods
SELECT * FROM assessment_periods WHERE company_id = '550e8400-e29b-41d4-a716-446655440001';

-- Step 3: Delete any existing baseline periods (cleanup)
DELETE FROM assessment_periods 
WHERE company_id = '550e8400-e29b-41d4-a716-446655440001' 
AND survey_wave = 'oct-2024-baseline';

-- Step 4: Update data to baseline wave
UPDATE respondents
SET survey_wave = 'oct-2024-baseline', assessment_date = '2024-10-15'
WHERE company_id = '550e8400-e29b-41d4-a716-446655440001';

UPDATE capability_scores
SET survey_wave = 'oct-2024-baseline', assessment_date = '2024-10-15'
WHERE company_id = '550e8400-e29b-41d4-a716-446655440001';

-- Step 5: Direct INSERT
INSERT INTO assessment_periods (
  company_id,
  survey_wave,
  assessment_date,
  name,
  description,
  interventions_applied,
  status
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'oct-2024-baseline',
  '2024-10-15',
  'Oct 2024 Baseline',
  'Initial baseline assessment',
  '{}',
  'active'
) RETURNING *;

-- Step 6: Update counts
UPDATE assessment_periods
SET 
  sentiment_respondents = (SELECT COUNT(DISTINCT respondent_id) FROM respondents WHERE company_id = '550e8400-e29b-41d4-a716-446655440001'),
  capability_respondents = (SELECT COUNT(DISTINCT respondent_id) FROM capability_scores WHERE company_id = '550e8400-e29b-41d4-a716-446655440001')
WHERE company_id = '550e8400-e29b-41d4-a716-446655440001'
AND survey_wave = 'oct-2024-baseline';

-- Step 7: Verify
SELECT * FROM assessment_periods WHERE company_id = '550e8400-e29b-41d4-a716-446655440001';

