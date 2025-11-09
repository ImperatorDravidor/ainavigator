"""
Generate November 2024 assessment data with improvements
Shows progress after implementing interventions A1, B2, and C1 in October
"""

import pandas as pd
import numpy as np
from pathlib import Path
import json

# Set random seed for reproducibility
np.random.seed(42)

def load_baseline_data():
    """Load October 2024 baseline data"""
    data_dir = Path(__file__).parent.parent / 'data' / 'csv-imports'
    
    # Load sentiment data
    sentiment_df = pd.read_csv(data_dir / 'sentiment_realistic.csv')
    
    # Load capability data
    capability_df = pd.read_csv(data_dir / 'capability_demo.csv')
    
    return sentiment_df, capability_df

def improve_sentiment_scores(df, improvement_rate=0.15):
    """
    Apply improvements to sentiment scores
    Simulates impact of interventions A1 (Strategy), B2 (Training), C1 (Innovation)
    
    Focus areas based on interventions:
    - A1: Improves questions 21-25 (organizational stability)
    - B2: Improves questions 6-10 (collaboration & trust)
    - C1: Improves questions 16-20 (career development)
    """
    df_nov = df.copy()
    
    # Change respondent IDs to indicate November wave (handle both naming conventions)
    id_col = 'RespondentID' if 'RespondentID' in df_nov.columns else 'respondent_id'
    df_nov[id_col] = df_nov[id_col].apply(lambda x: f"NOV_{x}")
    
    # Improvement mapping: which questions each intervention improves
    intervention_impacts = {
        'A1_strategy': list(range(21, 26)),  # Q21-Q25: Org stability
        'B2_training': list(range(6, 11)),    # Q6-Q10: Collaboration
        'C1_innovation': list(range(16, 21))  # Q16-Q20: Career development
    }
    
    # Apply improvements
    for intervention, questions in intervention_impacts.items():
        for q in questions:
            col_name = f'sentiment_{q}'
            if col_name in df_nov.columns:
                # Improve scores: add 15% on average, with some variation
                improvement = np.random.normal(improvement_rate, 0.05, len(df_nov))
                # Ensure we don't exceed max score of 5.0
                df_nov[col_name] = np.minimum(
                    df_nov[col_name] + improvement,
                    5.0
                )
    
    # Add some general improvement to all questions (ambient improvement)
    for i in range(1, 26):
        col_name = f'sentiment_{i}'
        if col_name in df_nov.columns:
            ambient_improvement = np.random.normal(0.05, 0.02, len(df_nov))
            df_nov[col_name] = np.minimum(
                df_nov[col_name] + ambient_improvement,
                5.0
            )
    
    return df_nov

def improve_capability_scores(df, improvement_rate=0.12):
    """
    Apply improvements to capability scores
    
    Focus areas based on interventions:
    - A1: Dimension 1 (Strategy & Vision)
    - B2: Dimension 4 (Talent & Skills), Dimension 7 (Adaptation & Adoption)
    - C1: Dimension 6 (Innovation Capability)
    """
    df_nov = df.copy()
    
    # Change respondent IDs (handle both naming conventions)
    id_col = 'ResponseId_id' if 'ResponseId_id' in df_nov.columns else 'respondent_id'
    df_nov[id_col] = df_nov[id_col].apply(lambda x: f"NOV_{x}")
    
    # Dimensions that benefit from our interventions
    high_impact_dimensions = [1, 4, 6, 7]  # Strategy, Talent, Innovation, Adoption
    
    for idx, row in df_nov.iterrows():
        dim = row['dimension_id']
        
        if dim in high_impact_dimensions:
            # Higher improvement for targeted dimensions
            improvement = np.random.normal(improvement_rate, 0.04)
        else:
            # Modest improvement for other dimensions
            improvement = np.random.normal(0.06, 0.02)
        
        # Apply improvement (max score is 5.0)
        df_nov.at[idx, 'score'] = min(row['score'] + improvement, 5.0)
    
    return df_nov

def generate_november_sql(sentiment_df, capability_df, output_path):
    """Generate SQL to insert November 2024 data"""
    
    company_id_query = "(SELECT id FROM companies WHERE name = 'acme-wealth')"
    
    sql_lines = [
        "-- November 2024 Assessment Data",
        "-- Shows progress after implementing interventions A1, B2, and C1",
        "-- Generated with improved scores in targeted areas",
        "",
        "-- ============================================================================",
        "-- 1. CREATE NOVEMBER 2024 ASSESSMENT PERIOD",
        "-- ============================================================================",
        "",
        "INSERT INTO assessment_periods (",
        "  company_id,",
        "  survey_wave,",
        "  assessment_date,",
        "  name,",
        "  description,",
        "  interventions_applied,",
        "  status",
        ")",
        "SELECT",
        f"  {company_id_query},",
        "  'nov-2024',",
        "  '2024-11-15'::DATE,",
        "  'Nov 2024 Progress Check',",
        "  'Follow-up assessment showing impact of interventions A1 (Strategy & Governance), B2 (AI Literacy Training), and C1 (Innovation Labs).',",
        "  ARRAY['A1', 'B2', 'C1']::TEXT[],",
        "  'active'",
        "ON CONFLICT DO NOTHING;",
        "",
        "-- ============================================================================",
        "-- 2. INSERT APPLIED INTERVENTIONS RECORDS",
        "-- ============================================================================",
        "",
        "-- Record that these interventions were applied in October",
        "INSERT INTO applied_interventions (",
        "  company_id,",
        "  assessment_period_id,",
        "  intervention_code,",
        "  applied_date,",
        "  status,",
        "  notes",
        ")",
        "VALUES",
        f"  ({company_id_query}, (SELECT id FROM assessment_periods WHERE survey_wave = 'oct-2024-baseline' AND company_id = {company_id_query}), 'A1', '2024-10-20', 'completed', 'AI Strategy & Governance framework implemented'),",
        f"  ({company_id_query}, (SELECT id FROM assessment_periods WHERE survey_wave = 'oct-2024-baseline' AND company_id = {company_id_query}), 'B2', '2024-10-25', 'completed', 'AI Literacy training rolled out to all departments'),",
        f"  ({company_id_query}, (SELECT id FROM assessment_periods WHERE survey_wave = 'oct-2024-baseline' AND company_id = {company_id_query}), 'C1', '2024-11-01', 'completed', 'Innovation Labs launched with pilot projects')",
        "ON CONFLICT DO NOTHING;",
        "",
        "-- ============================================================================",
        "-- 3. INSERT NOVEMBER SENTIMENT DATA",
        "-- ============================================================================",
        "",
    ]
    
    # Generate INSERT statements for sentiment data (batch inserts for efficiency)
    batch_size = 50
    for batch_start in range(0, len(sentiment_df), batch_size):
        batch_end = min(batch_start + batch_size, len(sentiment_df))
        batch = sentiment_df.iloc[batch_start:batch_end]
        
        sql_lines.append("INSERT INTO respondents (")
        sql_lines.append("  company_id, respondent_id, region, department, employment_type, age, user_language, industry, continent,")
        sql_lines.append("  survey_wave, assessment_date,")
        sql_lines.append("  " + ", ".join([f"sentiment_{i}" for i in range(1, 26)]))
        sql_lines.append(") VALUES")
        
        values = []
        for _, row in batch.iterrows():
            sentiment_values = ", ".join([
                f"{row[f'sentiment_{i}']:.2f}" if pd.notna(row.get(f'sentiment_{i}')) else "NULL"
                for i in range(1, 26)
            ])
            
            # Handle both naming conventions
            respondent_id = row.get('RespondentID') or row.get('respondent_id')
            region = row.get('Region') or row.get('region', 'Unknown')
            department = row.get('Department') or row.get('department', 'Unknown')
            employment = row.get('EmploymentType') or row.get('employment_type', 'Full-time')
            age = row.get('Age') or row.get('age', '30-39')
            language = row.get('UserLanguage') or row.get('user_language', 'en')
            industry = row.get('Industry') or row.get('industry', 'Financial Services')
            continent = row.get('Continent') or row.get('continent', 'North America')
            
            values.append(
                f"  ({company_id_query}, '{respondent_id}', "
                f"'{region}', '{department}', "
                f"'{employment}', '{age}', "
                f"'{language}', '{industry}', "
                f"'{continent}', 'nov-2024', '2024-11-15', "
                f"{sentiment_values})"
            )
        
        sql_lines.append(",\n".join(values))
        sql_lines.append("ON CONFLICT DO NOTHING;")
        sql_lines.append("")
    
    sql_lines.extend([
        "-- ============================================================================",
        "-- 4. INSERT NOVEMBER CAPABILITY DATA",
        "-- ============================================================================",
        "",
    ])
    
    # Generate INSERT statements for capability data
    for batch_start in range(0, len(capability_df), batch_size):
        batch_end = min(batch_start + batch_size, len(capability_df))
        batch = capability_df.iloc[batch_start:batch_end]
        
        sql_lines.append("INSERT INTO capability_scores (")
        sql_lines.append("  company_id, respondent_id, dimension_id, dimension, construct_id, construct, score,")
        sql_lines.append("  industry_synthetic, country_synthetic, continent_synthetic, role_synthetic,")
        sql_lines.append("  survey_wave, assessment_date")
        sql_lines.append(") VALUES")
        
        values = []
        for _, row in batch.iterrows():
            # Handle both naming conventions
            respondent_id = row.get('ResponseId_id') or row.get('respondent_id')
            
            values.append(
                f"  ({company_id_query}, '{respondent_id}', "
                f"{row['dimension_id']}, '{row['dimension']}', "
                f"{row['construct_id']}, '{row['construct']}', {row['score']:.2f}, "
                f"'{row.get('industry_synthetic', 'Financial Services')}', "
                f"'{row.get('country_synthetic', 'USA')}', "
                f"'{row.get('continent_synthetic', 'North America')}', "
                f"'{row.get('role_synthetic', 'Analyst')}', "
                f"'nov-2024', '2024-11-15')"
            )
        
        sql_lines.append(",\n".join(values))
        sql_lines.append("ON CONFLICT DO NOTHING;")
        sql_lines.append("")
    
    sql_lines.extend([
        "-- ============================================================================",
        "-- 5. UPDATE RESPONDENT COUNTS",
        "-- ============================================================================",
        "",
        "UPDATE assessment_periods ap",
        "SET",
        "  sentiment_respondents = (",
        "    SELECT COUNT(DISTINCT respondent_id)",
        "    FROM respondents r",
        "    WHERE r.company_id = ap.company_id",
        "      AND r.survey_wave = 'nov-2024'",
        "  ),",
        "  capability_respondents = (",
        "    SELECT COUNT(DISTINCT respondent_id)",
        "    FROM capability_scores cs",
        "    WHERE cs.company_id = ap.company_id",
        "      AND cs.survey_wave = 'nov-2024'",
        "  ),",
        "  updated_at = NOW()",
        "WHERE survey_wave = 'nov-2024';",
        "",
        "-- Verify",
        "DO $$",
        "DECLARE",
        "  sentiment_count INTEGER;",
        "  capability_count INTEGER;",
        "BEGIN",
        "  SELECT COUNT(*) INTO sentiment_count FROM respondents WHERE survey_wave = 'nov-2024';",
        "  SELECT COUNT(*) INTO capability_count FROM capability_scores WHERE survey_wave = 'nov-2024';",
        "  ",
        "  RAISE NOTICE 'November 2024 Data Loaded:';",
        "  RAISE NOTICE '  Sentiment respondents: %', sentiment_count;",
        "  RAISE NOTICE '  Capability scores: %', capability_count;",
        "END $$;",
    ])
    
    # Write to file
    with open(output_path, 'w') as f:
        f.write('\n'.join(sql_lines))
    
    print(f"✅ Generated SQL file: {output_path}")

def main():
    print("🚀 Generating November 2024 assessment data with improvements...")
    
    # Load baseline data
    print("📊 Loading October 2024 baseline data...")
    sentiment_df, capability_df = load_baseline_data()
    print(f"   Loaded {len(sentiment_df)} sentiment responses")
    print(f"   Loaded {len(capability_df)} capability scores")
    
    # Apply improvements
    print("\n📈 Applying improvements based on interventions A1, B2, C1...")
    sentiment_nov = improve_sentiment_scores(sentiment_df)
    capability_nov = improve_capability_scores(capability_df)
    
    # Calculate average improvements
    sentiment_cols = [f'sentiment_{i}' for i in range(1, 26)]
    avg_improvement_sentiment = (
        sentiment_nov[sentiment_cols].mean().mean() - 
        sentiment_df[sentiment_cols].mean().mean()
    )
    avg_improvement_capability = (
        capability_nov['score'].mean() - 
        capability_df['score'].mean()
    )
    
    print(f"   Average sentiment improvement: +{avg_improvement_sentiment:.3f}")
    print(f"   Average capability improvement: +{avg_improvement_capability:.3f}")
    
    # Generate SQL
    print("\n📝 Generating SQL migration...")
    output_path = Path(__file__).parent.parent / 'supabase' / 'migrations' / '012_nov_2024_data.sql'
    generate_november_sql(sentiment_nov, capability_nov, output_path)
    
    # Also save CSVs for reference
    csv_output_dir = Path(__file__).parent.parent / 'data' / 'csv-imports'
    sentiment_nov.to_csv(csv_output_dir / 'sentiment_nov_2024.csv', index=False)
    capability_nov.to_csv(csv_output_dir / 'capability_nov_2024.csv', index=False)
    print(f"✅ Saved CSV files to: {csv_output_dir}")
    
    print("\n✨ Done! You can now run the migration to load November 2024 data.")
    print(f"\n📊 Summary:")
    print(f"   - Oct 2024 Baseline: {len(sentiment_df)} respondents")
    print(f"   - Nov 2024 Progress: {len(sentiment_nov)} respondents")
    print(f"   - Interventions applied: A1, B2, C1")
    print(f"   - Overall improvement: +{((avg_improvement_sentiment + avg_improvement_capability) / 2):.1%}")

if __name__ == '__main__':
    main()

