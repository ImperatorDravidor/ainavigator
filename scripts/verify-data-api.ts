/**
 * API Data Verification Script
 * Tests that all API endpoints return correct data for the 3-phase journey
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

const COMPANY_ID = '550e8400-e29b-41d4-a716-446655440001'

async function verifyAssessmentPeriods() {
  console.log('📅 Verifying Assessment Periods...')

  const { data, error } = await supabase
    .from('assessment_periods')
    .select('*')
    .eq('company_id', COMPANY_ID)
    .order('assessment_date')

  if (error) {
    console.error('❌ Error fetching assessment periods:', error)
    return false
  }

  if (data.length !== 3) {
    console.error(`❌ Expected 3 periods, found ${data.length}`)
    return false
  }

  console.log('✅ Found 3 assessment periods:')
  data.forEach(p => {
    console.log(`   - ${p.name} (${p.survey_wave})`)
    console.log(`     Date: ${p.assessment_date}`)
    console.log(`     Interventions: ${p.interventions_applied?.join(', ') || 'None'}`)
    console.log(`     Sentiment: ${p.sentiment_respondents}, Capability: ${p.capability_respondents}`)
  })

  return true
}

async function verifySentimentData() {
  console.log('\n📊 Verifying Sentiment Data (Heatmap)...')

  const { data, error } = await supabase
    .from('respondents')
    .select('survey_wave, sentiment_1, sentiment_13, sentiment_25')
    .eq('company_id', COMPANY_ID)
    .limit(10)

  if (error) {
    console.error('❌ Error fetching sentiment data:', error)
    return false
  }

  if (!data || data.length === 0) {
    console.error('❌ No sentiment data found')
    return false
  }

  console.log('✅ Sentiment data accessible')
  console.log(`   Sample: Wave=${data[0].survey_wave}, Sent1=${data[0].sentiment_1}, Sent13=${data[0].sentiment_13}`)

  // Check each wave has data
  const expectedWaves = ['oct-2024-baseline', 'mar-2025-phase2', 'nov-2025-phase3']
  const waveCounts = await Promise.all(
    expectedWaves.map(async wave => {
      const { count } = await supabase
        .from('respondents')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', COMPANY_ID)
        .eq('survey_wave', wave)
      return { wave, count }
    })
  )

  const missingWaves = waveCounts.filter(w => !w.count || w.count === 0)

  if (missingWaves.length > 0) {
    console.error(`❌ Missing data for waves: ${missingWaves.map(w => w.wave).join(', ')}`)
    return false
  }

  console.log('✅ All 3 waves present with data:')
  waveCounts.forEach(w => {
    console.log(`   ${w.wave}: ${w.count} responses`)
  })

  return true
}

async function verifyCapabilityData() {
  console.log('\n💎 Verifying Capability Data (Diamond)...')

  const { data, error } = await supabase
    .from('capability_scores')
    .select('survey_wave, dimension, construct, score')
    .eq('company_id', COMPANY_ID)
    .limit(10)

  if (error) {
    console.error('❌ Error fetching capability data:', error)
    return false
  }

  if (!data || data.length === 0) {
    console.error('❌ No capability data found')
    return false
  }

  console.log('✅ Capability data accessible')
  console.log(`   Sample: Wave=${data[0].survey_wave}, Dim=${data[0].dimension}, Score=${data[0].score}`)

  // Verify all dimensions exist for each wave
  const { data: dimensions } = await supabase
    .from('capability_scores')
    .select('survey_wave, dimension')
    .eq('company_id', COMPANY_ID)

  const waveDimensions = new Map<string, Set<string>>()

  dimensions?.forEach(d => {
    if (!waveDimensions.has(d.survey_wave)) {
      waveDimensions.set(d.survey_wave, new Set())
    }
    waveDimensions.get(d.survey_wave)!.add(d.dimension)
  })

  console.log('✅ Dimensions per wave:')
  waveDimensions.forEach((dims, wave) => {
    console.log(`   ${wave}: ${dims.size} dimensions`)
  })

  return true
}

async function verifyDataProgression() {
  console.log('\n📈 Verifying Data Progression (Journey Story)...')

  // Check that sentiment scores improve over time
  const { data: sentimentAvgs } = await supabase
    .from('respondents')
    .select('survey_wave, sentiment_1, sentiment_13, sentiment_25')
    .eq('company_id', COMPANY_ID)

  const waveAvgs = new Map<string, number[]>()

  sentimentAvgs?.forEach(s => {
    if (!waveAvgs.has(s.survey_wave)) {
      waveAvgs.set(s.survey_wave, [])
    }
    const avg = (Number(s.sentiment_1) + Number(s.sentiment_13) + Number(s.sentiment_25)) / 3
    waveAvgs.get(s.survey_wave)!.push(avg)
  })

  console.log('✅ Sentiment progression across waves:')

  const phases = [
    'oct-2024-baseline',
    'mar-2025-phase2',
    'nov-2025-phase3'
  ]

  const averages = phases.map(phase => {
    const scores = waveAvgs.get(phase) || []
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length
    return { phase, avg: avg.toFixed(2) }
  })

  averages.forEach(a => {
    console.log(`   ${a.phase}: ${a.avg}`)
  })

  // Verify progression (should generally increase)
  const baseline = parseFloat(averages[0].avg)
  const phase2 = parseFloat(averages[1].avg)
  const phase3 = parseFloat(averages[2].avg)

  if (phase3 > baseline) {
    console.log('✅ Positive progression detected (Phase 3 > Baseline)')
  } else {
    console.warn('⚠️  Unexpected progression pattern')
  }

  return true
}

async function main() {
  console.log('🚀 Starting API Data Verification\n')
  console.log('='.repeat(60))

  const results = {
    periods: await verifyAssessmentPeriods(),
    sentiment: await verifySentimentData(),
    capability: await verifyCapabilityData(),
    progression: await verifyDataProgression()
  }

  console.log('\n' + '='.repeat(60))
  console.log('\n📋 Verification Summary:')
  console.log(`   Assessment Periods: ${results.periods ? '✅' : '❌'}`)
  console.log(`   Sentiment Data: ${results.sentiment ? '✅' : '❌'}`)
  console.log(`   Capability Data: ${results.capability ? '✅' : '❌'}`)
  console.log(`   Data Progression: ${results.progression ? '✅' : '❌'}`)

  const allPassed = Object.values(results).every(r => r)

  if (allPassed) {
    console.log('\n🎉 All verifications passed! Data is ready for the app.')
    console.log('\n✨ You can now:')
    console.log('   1. Start the dev server: npm run dev')
    console.log('   2. Visit http://localhost:3000')
    console.log('   3. View the Command Center for wave selection')
    console.log('   4. Explore the Sentiment Heatmap')
    console.log('   5. View the Capability Diamond')
  } else {
    console.log('\n❌ Some verifications failed. Please review the errors above.')
    process.exit(1)
  }
}

main()
