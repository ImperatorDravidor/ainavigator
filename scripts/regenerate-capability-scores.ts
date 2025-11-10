/**
 * Regenerate Capability Scores for Phase 2 and Phase 3
 *
 * The capability_scores table stores data in LONG format (one row per construct per respondent).
 * This script applies intervention-based improvements to capability dimensions.
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import {
  INTERVENTIONS,
  isDimensionTargeted,
  calculateNaturalVariance
} from '../lib/constants/interventions'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)
const COMPANY_ID = '550e8400-e29b-41d4-a716-446655440001'

async function regenerateCapabilityScores() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🔧 CAPABILITY SCORES REGENERATION')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  try {
    // Step 1: Get baseline respondents
    console.log('📊 Step 1: Fetching baseline respondents...')
    const { data: baselineRespondents, error: respError } = await supabase
      .from('respondents')
      .select('respondent_id')
      .eq('survey_wave', 'oct-2024-baseline')
      .eq('company_id', COMPANY_ID)
      .order('respondent_id', { ascending: true })

    if (respError) throw new Error(`Failed to fetch baseline respondents: ${respError.message}`)
    if (!baselineRespondents || baselineRespondents.length === 0) {
      throw new Error('No baseline respondents found')
    }

    console.log(`✅ Found ${baselineRespondents.length} baseline respondents\n`)

    // Step 2: Generate baseline capability scores from scratch
    console.log('🔨 Generating baseline capability scores...')
    const baselineScores = generateBaselineCapabilityScores(
      baselineRespondents.map(r => r.respondent_id),
      'oct-2024-baseline',
      new Date('2024-10-15')
    )

    console.log(`✅ Generated ${baselineScores.length} baseline capability scores\n`)

    // Delete ALL old capability scores (baseline, phase 2, phase 3)
    console.log('🗑️  Deleting all old capability scores...')
    const { error: deleteAllError } = await supabase
      .from('capability_scores')
      .delete()
      .eq('company_id', COMPANY_ID)

    if (deleteAllError) throw new Error(`Failed to delete old scores: ${deleteAllError.message}`)
    console.log('✅ All old capability scores deleted\n')

    // Insert baseline scores
    console.log('💾 Inserting baseline capability scores...')
    await insertInChunks(baselineScores, 'Baseline')
    console.log('✅ Baseline inserted\n')

    // Step 3: Generate Phase 2 capability scores
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📈 PHASE 2: Applying interventions [A1, B2, C1]')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    const phase2Interventions = ['A1', 'B2', 'C1']
    const phase2Scores = applyCapabilityInterventions(
      baselineScores,
      phase2Interventions,
      'mar-2025-phase2',
      new Date('2025-03-01')
    )

    console.log(`✅ Generated ${phase2Scores.length} Phase 2 capability scores\n`)

    // Insert Phase 2 in chunks
    console.log('💾 Inserting Phase 2 capability scores...')
    await insertInChunks(phase2Scores, 'Phase 2')
    console.log('✅ Phase 2 inserted\n')

    // Step 4: Generate Phase 3 from Phase 2
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🚀 PHASE 3: Applying interventions [A2, C3, D1]')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    const phase3Interventions = ['A2', 'C3', 'D1']
    const phase3Scores = applyCapabilityInterventions(
      phase2Scores,
      phase3Interventions,
      'nov-2025-phase3',
      new Date('2025-11-01')
    )

    console.log(`✅ Generated ${phase3Scores.length} Phase 3 capability scores\n`)

    // Insert Phase 3 in chunks
    console.log('💾 Inserting Phase 3 capability scores...')
    await insertInChunks(phase3Scores, 'Phase 3')
    console.log('✅ Phase 3 inserted\n')

    // Summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🎉 SUCCESS! Capability scores regenerated')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    console.log('📊 Capability progression should now show:')
    console.log('   Baseline < Phase 2 < Phase 3 (progressive improvement)\n')

  } catch (error: any) {
    console.error('\n❌ ERROR:', error.message)
    process.exit(1)
  }
}

// Dimension and construct metadata
const DIMENSIONS = [
  { id: 1, name: 'Strategy and Vision', constructs: [
    'Alignment with Business Goals', 'Clear AI Vision', 'Leadership Commitment', 'Strategic Roadmap'
  ]},
  { id: 2, name: 'Data', constructs: [
    'Data Quality', 'Data Accessibility', 'Data Governance', 'Data Infrastructure'
  ]},
  { id: 3, name: 'Technology', constructs: [
    'AI Tools & Platforms', 'Technical Infrastructure', 'Integration Capabilities', 'Scalability'
  ]},
  { id: 4, name: 'Talent and Skills', constructs: [
    'AI Skills & Expertise', 'Training Programs', 'Talent Retention', 'Knowledge Sharing'
  ]},
  { id: 5, name: 'Organisation and Processes', constructs: [
    'Process Optimization', 'Organizational Structure', 'Cross-functional Collaboration', 'Change Management'
  ]},
  { id: 6, name: 'Innovation', constructs: [
    'Innovation Culture', 'Experimentation', 'Risk Appetite', 'Learning from Failure'
  ]},
  { id: 7, name: 'Adaptation and Adoption', constructs: [
    'User Adoption', 'Flexibility', 'Continuous Improvement', 'Feedback Mechanisms'
  ]},
  { id: 8, name: 'Ethics and Responsibility', constructs: [
    'Ethical Guidelines', 'Transparency', 'Fairness & Bias Mitigation', 'Regulatory Compliance'
  ]}
]

/**
 * Generate baseline capability scores for all respondents
 * Creates 32 construct scores (4 per dimension × 8 dimensions) for each respondent
 */
function generateBaselineCapabilityScores(
  respondentIds: string[],
  surveyWave: string,
  assessmentDate: Date
): any[] {
  const scores: any[] = []

  respondentIds.forEach(respondentId => {
    DIMENSIONS.forEach(dimension => {
      dimension.constructs.forEach((construct, constructIndex) => {
        // Generate realistic baseline score (3.5-5.5 range, normally distributed)
        const mean = 4.0
        const stdDev = 0.6
        const u1 = Math.random()
        const u2 = Math.random()
        const standardNormal = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
        let score = mean + standardNormal * stdDev
        score = Math.max(1.0, Math.min(7.0, score))

        scores.push({
          respondent_id: respondentId,
          company_id: COMPANY_ID,
          dimension_id: dimension.id,
          dimension: dimension.name,
          construct_id: (dimension.id - 1) * 4 + constructIndex + 1,
          construct,
          score: parseFloat(score.toFixed(2)),
          industry_synthetic: 'Financial Services',
          country_synthetic: 'United States',
          continent_synthetic: 'North America',
          role_synthetic: 'Professional',
          assessment_date: assessmentDate.toISOString().split('T')[0],
          survey_wave: surveyWave
        })
      })
    })
  })

  return scores
}

/**
 * Apply intervention-based improvements to capability scores
 */
function applyCapabilityInterventions(
  baselineScores: any[],
  appliedInterventions: string[],
  surveyWave: string,
  assessmentDate: Date
): any[] {
  return baselineScores.map(score => {
    const { id, ...scoreData } = score
    let newScore = scoreData.score
    const dimensionId = scoreData.dimension_id

    // Update respondent_id for new phase
    const baseRespondentId = scoreData.respondent_id
    let newRespondentId: string

    if (baseRespondentId.startsWith('RESP_')) {
      // Baseline: RESP_0001 -> mar-2025-phase2-0001
      const respNumber = baseRespondentId.replace('RESP_', '')
      newRespondentId = `${surveyWave}-${respNumber}`
    } else if (baseRespondentId.includes('-')) {
      // Phase 2: mar-2025-phase2-0001 -> nov-2025-phase3-0001
      const respNumber = baseRespondentId.split('-').pop()!
      newRespondentId = `${surveyWave}-${respNumber}`
    } else {
      throw new Error(`Unknown respondent_id format: ${baseRespondentId}`)
    }

    // Check if this dimension is targeted by any intervention
    const targetingIntervention = isDimensionTargeted(dimensionId, appliedInterventions)

    if (targetingIntervention) {
      // Apply MAJOR improvement from intervention
      const intervention = INTERVENTIONS[targetingIntervention]
      const baseIncrease = intervention.impact.capabilityIncrease
      const variance = baseIncrease * (Math.random() * 0.2 - 0.1) // ±10%
      newScore = scoreData.score + baseIncrease + variance
      newScore = Math.max(1.0, Math.min(7.0, newScore)) // Clamp to 1-7
    } else {
      // Apply natural variance (slight improvement)
      const variance = calculateNaturalVariance('capability')
      newScore = scoreData.score + variance
      newScore = Math.max(1.0, Math.min(7.0, newScore)) // Clamp to 1-7
    }

    return {
      ...scoreData,
      respondent_id: newRespondentId,
      score: parseFloat(newScore.toFixed(2)),
      survey_wave: surveyWave,
      assessment_date: assessmentDate.toISOString().split('T')[0]
    }
  })
}

async function insertInChunks(data: any[], phaseName: string) {
  const chunkSize = 500
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize)
    const { error } = await supabase.from('capability_scores').insert(chunk)
    if (error) throw new Error(`Failed to insert ${phaseName} chunk: ${error.message}`)
    console.log(`   ✓ Inserted ${Math.min(i + chunkSize, data.length)}/${data.length} rows`)
  }
}

// Run
regenerateCapabilityScores()
