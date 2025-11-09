/**
 * Complete Journey Data Loader
 * Loads all 3 phases of the AI Navigator assessment journey
 * Phase 1: Oct 2024 Baseline
 * Phase 2: Mar 2025 (after interventions A1, B2, C1)
 * Phase 3: Nov 2025 (after interventions B1, B3, A2)
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import Papa from 'papaparse'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const COMPANY_ID = '550e8400-e29b-41d4-a716-446655440001'

interface PhaseConfig {
  name: string
  surveyWave: string
  assessmentDate: string
  description: string
  interventionsApplied: string[]
  sentimentFile: string
  capabilityFile: string
}

const PHASES: PhaseConfig[] = [
  {
    name: 'Phase 1: Oct 2024 Baseline',
    surveyWave: 'oct-2024-baseline',
    assessmentDate: '2024-10-15',
    description: 'Initial baseline assessment before any interventions',
    interventionsApplied: [],
    sentimentFile: 'data/csv-imports/journey/oct_2024_baseline_sentiment.csv',
    capabilityFile: 'data/csv-imports/journey/oct_2024_baseline_capability.csv'
  },
  {
    name: 'Phase 2: Mar 2025 Post-Intervention',
    surveyWave: 'mar-2025-phase2',
    assessmentDate: '2025-03-15',
    description: 'Assessment after applying interventions A1 (AI Adoption Program), B2 (Change Champions Network), and C1 (Innovation Lab)',
    interventionsApplied: ['A1', 'B2', 'C1'],
    sentimentFile: 'data/csv-imports/journey/march_2025_phase2_sentiment.csv',
    capabilityFile: 'data/csv-imports/journey/march_2025_phase2_capability.csv'
  },
  {
    name: 'Phase 3: Nov 2025 Advanced',
    surveyWave: 'nov-2025-phase3',
    assessmentDate: '2025-11-15',
    description: 'Assessment after additional interventions B1 (Executive Coaching), B3 (Best Practice Sharing Platform), and A2 (Governance Framework)',
    interventionsApplied: ['B1', 'B3', 'A2'],
    sentimentFile: 'data/csv-imports/journey/nov_2025_phase3_sentiment.csv',
    capabilityFile: 'data/csv-imports/journey/nov_2025_phase3_capability.csv'
  }
]

async function clearExistingData() {
  console.log('🧹 Clearing existing data...')

  // Delete in correct order due to foreign keys
  await supabase.from('applied_interventions').delete().eq('company_id', COMPANY_ID)
  await supabase.from('capability_scores').delete().eq('company_id', COMPANY_ID)
  await supabase.from('respondents').delete().eq('company_id', COMPANY_ID)
  await supabase.from('assessment_periods').delete().eq('company_id', COMPANY_ID)

  console.log('✅ Existing data cleared')
}

async function createAssessmentPeriods() {
  console.log('📅 Creating assessment periods...')

  for (const phase of PHASES) {
    const { error } = await supabase.from('assessment_periods').insert({
      company_id: COMPANY_ID,
      survey_wave: phase.surveyWave,
      assessment_date: phase.assessmentDate,
      name: phase.name,
      description: phase.description,
      interventions_applied: phase.interventionsApplied,
      status: 'active',
      sentiment_respondents: 0,
      capability_respondents: 0
    })

    if (error) {
      console.error(`Error creating period ${phase.name}:`, error)
      throw error
    }

    console.log(`✅ Created: ${phase.name}`)
  }
}

async function loadSentimentData(phase: PhaseConfig) {
  console.log(`📊 Loading sentiment data for ${phase.name}...`)

  const filePath = path.resolve(process.cwd(), phase.sentimentFile)

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`)
    return
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const parsed = Papa.parse(fileContent, { header: true, skipEmptyLines: true })

  const rows = parsed.data as any[]
  console.log(`   Found ${rows.length} sentiment responses`)

  const batchSize = 100
  let loaded = 0

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize).map(row => ({
      company_id: COMPANY_ID,
      respondent_id: row.respondent_id,
      region: row.region,
      department: row.department,
      employment_type: row.employment_type,
      age: row.age,
      user_language: row.user_language,
      survey_wave: phase.surveyWave,
      assessment_date: phase.assessmentDate,
      sentiment_1: parseFloat(row.sentiment_1) || null,
      sentiment_2: parseFloat(row.sentiment_2) || null,
      sentiment_3: parseFloat(row.sentiment_3) || null,
      sentiment_4: parseFloat(row.sentiment_4) || null,
      sentiment_5: parseFloat(row.sentiment_5) || null,
      sentiment_6: parseFloat(row.sentiment_6) || null,
      sentiment_7: parseFloat(row.sentiment_7) || null,
      sentiment_8: parseFloat(row.sentiment_8) || null,
      sentiment_9: parseFloat(row.sentiment_9) || null,
      sentiment_10: parseFloat(row.sentiment_10) || null,
      sentiment_11: parseFloat(row.sentiment_11) || null,
      sentiment_12: parseFloat(row.sentiment_12) || null,
      sentiment_13: parseFloat(row.sentiment_13) || null,
      sentiment_14: parseFloat(row.sentiment_14) || null,
      sentiment_15: parseFloat(row.sentiment_15) || null,
      sentiment_16: parseFloat(row.sentiment_16) || null,
      sentiment_17: parseFloat(row.sentiment_17) || null,
      sentiment_18: parseFloat(row.sentiment_18) || null,
      sentiment_19: parseFloat(row.sentiment_19) || null,
      sentiment_20: parseFloat(row.sentiment_20) || null,
      sentiment_21: parseFloat(row.sentiment_21) || null,
      sentiment_22: parseFloat(row.sentiment_22) || null,
      sentiment_23: parseFloat(row.sentiment_23) || null,
      sentiment_24: parseFloat(row.sentiment_24) || null,
      sentiment_25: parseFloat(row.sentiment_25) || null
    }))

    const { error } = await supabase.from('respondents').insert(batch)

    if (error) {
      console.error(`Error loading batch ${i / batchSize + 1}:`, error)
      throw error
    }

    loaded += batch.length
    process.stdout.write(`\r   Loaded: ${loaded}/${rows.length}`)
  }

  console.log(`\n✅ Sentiment data loaded: ${loaded} responses`)

  // Update assessment period count
  await supabase
    .from('assessment_periods')
    .update({ sentiment_respondents: loaded })
    .eq('company_id', COMPANY_ID)
    .eq('survey_wave', phase.surveyWave)
}

async function loadCapabilityData(phase: PhaseConfig) {
  console.log(`💎 Loading capability data for ${phase.name}...`)

  const filePath = path.resolve(process.cwd(), phase.capabilityFile)

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`)
    return
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const parsed = Papa.parse(fileContent, { header: true, skipEmptyLines: true })

  const rows = parsed.data as any[]
  console.log(`   Found ${rows.length} capability scores (before deduplication)`)

  // Deduplicate by averaging scores for same respondent+construct
  const scoreMap = new Map<string, { scores: number[], data: any }>()

  rows.forEach(row => {
    const respId = row.respondent_id || row.ResponseId_id
    if (!respId || respId.trim() === '') return

    const key = `${respId}|${row.construct_id}`

    if (!scoreMap.has(key)) {
      scoreMap.set(key, { scores: [], data: row })
    }

    scoreMap.get(key)!.scores.push(parseFloat(row.score))
  })

  console.log(`   Deduplicated to ${scoreMap.size} unique scores`)

  const deduplicatedData = Array.from(scoreMap.entries()).map(([_, value]) => {
    const avgScore = value.scores.reduce((a, b) => a + b, 0) / value.scores.length
    const row = value.data
    const respId = row.respondent_id || row.ResponseId_id

    return {
      company_id: COMPANY_ID,
      respondent_id: respId,
      dimension_id: parseInt(row.dimension_id),
      dimension: row.dimension,
      construct_id: parseInt(row.construct_id),
      construct: row.construct,
      score: avgScore,
      survey_wave: phase.surveyWave,
      assessment_date: phase.assessmentDate,
      industry_synthetic: row.industry_synthetic || null,
      country_synthetic: row.country_synthetic || null,
      continent_synthetic: row.continent_synthetic || null,
      role_synthetic: row.role_synthetic || null
    }
  })

  const batchSize = 500
  let loaded = 0

  for (let i = 0; i < deduplicatedData.length; i += batchSize) {
    const batch = deduplicatedData.slice(i, i + batchSize)

    const { error } = await supabase.from('capability_scores').insert(batch)

    if (error) {
      console.error(`Error loading batch ${i / batchSize + 1}:`, error)
      throw error
    }

    loaded += batch.length
    process.stdout.write(`\r   Loaded: ${loaded}/${deduplicatedData.length}`)
  }

  console.log(`\n✅ Capability data loaded: ${loaded} scores`)

  // Update assessment period count (unique respondents)
  const { data: uniqueRespondents } = await supabase
    .from('capability_scores')
    .select('respondent_id', { count: 'exact' })
    .eq('company_id', COMPANY_ID)
    .eq('survey_wave', phase.surveyWave)

  const uniqueCount = new Set(uniqueRespondents?.map(r => r.respondent_id)).size

  await supabase
    .from('assessment_periods')
    .update({ capability_respondents: uniqueCount })
    .eq('company_id', COMPANY_ID)
    .eq('survey_wave', phase.surveyWave)
}

async function verifyData() {
  console.log('\n🔍 Verifying data...')

  const { data: periods } = await supabase
    .from('assessment_periods')
    .select('*')
    .eq('company_id', COMPANY_ID)
    .order('assessment_date')

  console.log('\n📊 Assessment Periods:')
  periods?.forEach(p => {
    console.log(`   ${p.name}`)
    console.log(`      Wave: ${p.survey_wave}`)
    console.log(`      Date: ${p.assessment_date}`)
    console.log(`      Sentiment Respondents: ${p.sentiment_respondents}`)
    console.log(`      Capability Respondents: ${p.capability_respondents}`)
    console.log(`      Interventions: ${p.interventions_applied?.join(', ') || 'None'}`)
  })

  const { count: sentimentCount } = await supabase
    .from('respondents')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', COMPANY_ID)

  const { count: capabilityCount } = await supabase
    .from('capability_scores')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', COMPANY_ID)

  console.log('\n📈 Total Data:')
  console.log(`   Sentiment Responses: ${sentimentCount}`)
  console.log(`   Capability Scores: ${capabilityCount}`)

  console.log('\n✅ Data verification complete!')
}

async function main() {
  console.log('🚀 Starting Complete Journey Data Load\n')

  try {
    await clearExistingData()
    await createAssessmentPeriods()

    for (const phase of PHASES) {
      console.log(`\n--- Loading ${phase.name} ---`)
      await loadSentimentData(phase)
      await loadCapabilityData(phase)
    }

    await verifyData()

    console.log('\n🎉 Complete journey data load successful!')
  } catch (error) {
    console.error('\n❌ Error during data load:', error)
    process.exit(1)
  }
}

main()
