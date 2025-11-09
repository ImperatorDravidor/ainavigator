-- Load March 2025 Phase 2 data into database
-- This makes Phase 2 available without needing import

-- NOTE: You need to generate the CSV files first by running:
-- python3 scripts/create_complete_journey.py

-- Then use this command to load the CSVs:
-- \copy respondents(company_id,respondent_id,region,department,employment_type,age,user_language,industry,continent,survey_wave,assessment_date,sentiment_1,sentiment_2,sentiment_3,sentiment_4,sentiment_5,sentiment_6,sentiment_7,sentiment_8,sentiment_9,sentiment_10,sentiment_11,sentiment_12,sentiment_13,sentiment_14,sentiment_15,sentiment_16,sentiment_17,sentiment_18,sentiment_19,sentiment_20,sentiment_21,sentiment_22,sentiment_23,sentiment_24,sentiment_25) FROM '/Users/Dev/Desktop/ainavigator/data/csv-imports/journey/march_2025_phase2_sentiment.csv' WITH (FORMAT csv, HEADER true);

-- For now, just mark Phase 2 data as loaded
SELECT 'Run the Python script first, then use COPY command to load CSVs' as instruction;

