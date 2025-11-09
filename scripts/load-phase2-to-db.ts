/**
 * Load Phase 2 (March 2025) data directly into database
 * Run with: npx tsx scripts/load-phase2-to-db.ts
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const COMPANY_ID = '550e8400-e29b-41d4-a716-446655440001'

async function main() {
  console.log('🚀 Loading March 2025 Phase 2 data...')
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  // Load sentiment CSV
  const sentimentPath = path.join(__dirname, '../data/csv-imports/journey/march_2025_phase2_sentiment.csv')
  const sentimentCsv = fs.readFileSync(sentimentPath, 'utf-8')
  const sentimentRows = parse(sentimentCsv, { columns: true })
  
  console.log(`📊 Loaded ${sentimentRows.length} sentiment responses`)
  
  // Load capability CSV  
  const capabilityPath = path.join(__dirname, '../data/csv-imports/journey/march_2025_phase2_capability.csv')
  const capabilityCsv = fs.readFileSync(capabilityPath, 'utf-8')
  const capabilityRows = parse(capabilityCsv, { columns: true })
  
  console.log(`📊 Loaded ${capabilityRows.length} capability scores`)
  
  // Insert sentiment data
  console.log('💾 Inserting sentiment data...')
  const sentimentRecords = sentimentRows.map((row: any) => ({
    company_id: COMPANY_ID,
    respondent_id: row.respondent_id,
    region: row.region,
    department: row.department,
    employment_type: row.employment_type,
    age: row.age,
    user_language: row.user_language,
    industry: row.industry,
    continent: row.continent,
    survey_wave: 'march-2025-phase2',
    assessment_date: '2025-03-15',
    sentiment_1: parseFloat(row.sentiment_1),
    sentiment_2: parseFloat(row.sentiment_2),
    sentiment_3: parseFloat(row.sentiment_3),
    sentiment_4: parseFloat(row.sentiment_4),
    sentiment_5: parseFloat(row.sentiment_5),
    sentiment_6: parseFloat(row.sentiment_6),
    sentiment_7: parseFloat(row.sentiment_7),
    sentiment_8: parseFloat(row.sentiment_8),
    sentiment_9: parseFloat(row.sentiment_9),
    sentiment_10: parseFloat(row.sentiment_10),
    sentiment_11: parseFloat(row.sentiment_11),
    sentiment_12: parseFloat(row.sentiment_12),
    sentiment_13: parseFloat(row.sentiment_13),
    sentiment_14: parseFloat(row.sentiment_14),
    sentiment_15: parseFloat(row.sentiment_15),
    sentiment_16: parseFloat(row.sentiment_16),
    sentiment_17: parseFloat(row.sentiment_17),
    sentiment_18: parseFloat(row.sentiment_18),
    sentiment_19: parseFloat(row.sentiment_19),
    sentiment_20: parseFloat(row.sentiment_20),
    sentiment_21: parseFloat(row.sentiment_21),
    sentiment_22: parseFloat(row.sentiment_22),
    sentiment_23: parseFloat(row.sentiment_23),
    sentiment_24: parseFloat(row.sentiment_24),
    sentiment_25: parseFloat(row.sentiment_25)
  }))
  
  const { error: sentError } = await supabase
    .from('respondents')
    .insert(sentimentRecords)
    
  if (sentError) {
    console.error('❌ Error inserting sentiment:', sentError)
  } else {
    console.log('✅ Sentiment data loaded')
  }
  
  // Insert capability data
  console.log('💾 Inserting capability data...')
  const capabilityRecords = capabilityRows.map((row: any) => ({
    company_id: COMPANY_ID,
    respondent_id: row.ResponseId_id || row.respondent_id,
    dimension_id: parseInt(row.dimension_id),
    dimension: row.dimension,
    construct_id: parseInt(row.construct_id),
    construct: row.construct,
    score: parseFloat(row.score),
    industry_synthetic: row.industry_synthetic,
    country_synthetic: row.country_synthetic,
    continent_synthetic: row.continent_synthetic,
    role_synthetic: row.role_synthetic,
    survey_wave: 'march-2025-phase2',
    assessment_date: '2025-03-15'
  }))
  
  // Batch insert (500 at a time)
  for (let i = 0; i < capabilityRecords.length; i += 500) {
    const batch = capabilityRecords.slice(i, i + 500)
    const { error: capError } = await supabase
      .from('capability_scores')
      .insert(batch)
      
    if (capError) {
      console.error(`❌ Error inserting capability batch ${i}:`, capError)
    } else {
      console.log(`✅ Capability batch ${i}-${i + batch.length} loaded`)
    }
  }
  
  console.log('✨ Phase 2 data loaded! Refresh your app.')
}

main().catch(console.error)

