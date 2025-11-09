-- Set up October 2024 as Baseline Assessment Period
-- Marks all existing data as the baseline period

-- ============================================================================
-- 1. UPDATE EXISTING DATA WITH BASELINE WAVE
-- ============================================================================

-- Update ALL existing respondents to baseline wave (no WHERE clause to ensure everything gets updated)
UPDATE respondents
SET 
  survey_wave = 'oct-2024-baseline',
  assessment_date = '2024-10-15'
WHERE company_id IN (SELECT id FROM companies WHERE name = 'acme-wealth');

-- Update ALL existing capability scores to baseline wave
UPDATE capability_scores
SET
  survey_wave = 'oct-2024-baseline',
  assessment_date = '2024-10-15'
WHERE company_id IN (SELECT id FROM companies WHERE name = 'acme-wealth');

-- ============================================================================
-- 2. CREATE ASSESSMENT PERIOD RECORD FOR BASELINE
-- ============================================================================

-- Insert baseline assessment period for Acme Wealth
INSERT INTO assessment_periods (
  company_id,
  survey_wave,
  assessment_date,
  name,
  description,
  interventions_applied,
  status
)
SELECT 
  id as company_id,
  'oct-2024-baseline',
  '2024-10-15'::DATE,
  'Oct 2024 Baseline',
  'Initial assessment before any interventions. Establishes baseline metrics for measuring future progress. Key challenges identified: low trust in AI autonomy, limited strategic alignment, and gaps in organizational readiness.',
  ARRAY[]::TEXT[], -- No interventions applied yet
  'active'
FROM companies
WHERE name = 'acme-wealth'
ON CONFLICT (company_id, survey_wave) DO UPDATE
  SET name = EXCLUDED.name,
      description = EXCLUDED.description,
      updated_at = NOW();

-- ============================================================================
-- 3. UPDATE RESPONDENT COUNTS
-- ============================================================================

-- Update counts for the baseline period
UPDATE assessment_periods ap
SET 
  sentiment_respondents = (
    SELECT COUNT(DISTINCT respondent_id)
    FROM respondents r
    WHERE r.company_id = ap.company_id 
      AND r.survey_wave = 'oct-2024-baseline'
  ),
  capability_respondents = (
    SELECT COUNT(DISTINCT r.respondent_id)
    FROM (
      SELECT DISTINCT 
        CASE 
          WHEN respondent_id IS NOT NULL THEN respondent_id
          WHEN "ResponseId_id" IS NOT NULL THEN "ResponseId_id"
          ELSE id::text
        END as respondent_id
      FROM capability_scores
      WHERE company_id = ap.company_id 
        AND survey_wave = 'oct-2024-baseline'
    ) r
  ),
  updated_at = NOW()
WHERE survey_wave = 'oct-2024-baseline';

-- ============================================================================
-- 4. VERIFY THE SETUP
-- ============================================================================

DO $$
DECLARE
  period_count INTEGER;
  sentiment_count INTEGER;
  capability_count INTEGER;
  capability_rows INTEGER;
BEGIN
  SELECT COUNT(*) INTO period_count FROM assessment_periods WHERE survey_wave = 'oct-2024-baseline';
  SELECT COUNT(*) INTO sentiment_count FROM respondents WHERE survey_wave = 'oct-2024-baseline';
  SELECT COUNT(*) INTO capability_rows FROM capability_scores WHERE survey_wave = 'oct-2024-baseline';
  
  RAISE NOTICE '============================================';
  RAISE NOTICE 'Oct 2024 Baseline Setup Complete';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'Assessment periods created: %', period_count;
  RAISE NOTICE 'Sentiment respondents: %', sentiment_count;
  RAISE NOTICE 'Capability score rows: %', capability_rows;
  RAISE NOTICE '============================================';
  
  IF period_count = 0 THEN
    RAISE WARNING 'No assessment periods created! Check if company exists.';
  END IF;
  
  IF sentiment_count = 0 THEN
    RAISE WARNING 'No sentiment data found! Check respondents table.';
  END IF;
  
  IF capability_rows = 0 THEN
    RAISE WARNING 'No capability data found! Check capability_scores table.';
  END IF;
END $$;
