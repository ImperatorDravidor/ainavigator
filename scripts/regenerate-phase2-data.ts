/**
 * Regenerate Phase 2 AND Phase 3 Data with Intervention-Based Story
 *
 * This script creates a complete intervention progression story:
 *
 * BASELINE (Oct 2024):
 * - Initial assessment showing problem areas
 *
 * PHASE 2 (Mar 2025) - Interventions: A1, B2, C1
 * - A1: Executive AI Vision Workshops → Strategy improvement
 * - B2: Transparent Communication → Reduced unclear value resistance
 * - C1: Skills Development → Talent capability boost
 *
 * PHASE 3 (Nov 2025) - Interventions: A2, C3, D1
 * - A2: AI Champions Network → Organization & career concerns
 * - C3: Advanced Certification → Innovation boost
 * - D1: AI Governance Framework → Ethics & remaining resistance
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import {
  generatePhase2FromBaseline,
  generatePhase3FromPhase2,
  validateGeneratedData
} from '../lib/data-generation/generate-phase-data'

// Load environment variables from .env.local
config({ path: '.env.local' })

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const COMPANY_ID = '550e8400-e29b-41d4-a716-446655440001' // Demo company

async function regenerateAllPhases() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🚀 INTERVENTION-BASED PHASE PROGRESSION GENERATOR')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  try {
    // Step 1: Fetch baseline data
    console.log('📊 Step 1: Fetching baseline data...')
    const { data: baselineData, error: fetchError } = await supabase
      .from('respondents')
      .select('*')
      .eq('survey_wave', 'oct-2024-baseline')
      .eq('company_id', COMPANY_ID)

    if (fetchError) {
      throw new Error(`Failed to fetch baseline data: ${fetchError.message}`)
    }

    if (!baselineData || baselineData.length === 0) {
      throw new Error('No baseline data found. Please import baseline data first.')
    }

    console.log(`✅ Found ${baselineData.length} baseline respondents\n`)

    // ═══════════════════════════════════════════════════════════
    // PHASE 2 GENERATION
    // ═══════════════════════════════════════════════════════════
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📈 PHASE 2: Initial Implementation (Mar 2025)')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    console.log('🎯 Interventions Applied: [A1, B2, C1]\n')
    console.log('   🔷 A1: Executive AI Vision Workshops')
    console.log('      Category: Leadership')
    console.log('      Targets: L1_C4, L2_C4 (sentiment) + Strategy & Vision (capability)')
    console.log('      Impact: -0.5 resistance, +0.9 capability')
    console.log('      Timeframe: Medium-term\n')
    console.log('   🔷 B2: Transparent AI Roadmap Communication')
    console.log('      Category: Communication')
    console.log('      Targets: L2_C3, L2_C4, L3_C3, L3_C4 (sentiment)')
    console.log('      Impact: -0.45 resistance')
    console.log('      Timeframe: Immediate\n')
    console.log('   🔷 C1: AI Skills Development Program')
    console.log('      Category: Training')
    console.log('      Targets: Multiple cells + Talent & Skills (capability)')
    console.log('      Impact: -0.4 resistance, +1.0 capability')
    console.log('      Timeframe: Medium-term\n')

    console.log('🔧 Generating Phase 2 data...')
    const phase2Data = generatePhase2FromBaseline(baselineData, COMPANY_ID)
    console.log(`✅ Generated ${phase2Data.length} Phase 2 respondents\n`)

    // Validate Phase 2 data
    console.log('🔍 Validating Phase 2 data...')
    const phase2Validation = validateGeneratedData(phase2Data)

    if (!phase2Validation.valid) {
      console.error('❌ Phase 2 validation failed:')
      phase2Validation.errors.forEach(error => console.error(`   • ${error}`))
      throw new Error('Phase 2 data validation failed')
    }

    console.log('✅ Phase 2 validation passed\n')

    // Delete old Phase 2 data
    console.log('🗑️  Deleting old Phase 2 data...')
    const { error: delete2Error } = await supabase
      .from('respondents')
      .delete()
      .eq('survey_wave', 'mar-2025-phase2')
      .eq('company_id', COMPANY_ID)

    if (delete2Error) {
      throw new Error(`Failed to delete old Phase 2 data: ${delete2Error.message}`)
    }

    console.log('✅ Old Phase 2 data deleted\n')

    // Insert new Phase 2 data (batch insert in chunks to avoid timeout)
    console.log('💾 Inserting new Phase 2 data...')
    const chunkSize = 100
    for (let i = 0; i < phase2Data.length; i += chunkSize) {
      const chunk = phase2Data.slice(i, i + chunkSize)
      const { error: insertError } = await supabase
        .from('respondents')
        .insert(chunk)

      if (insertError) {
        throw new Error(`Failed to insert Phase 2 chunk ${i}: ${insertError.message}`)
      }
      console.log(`   ✓ Inserted ${Math.min(i + chunkSize, phase2Data.length)}/${phase2Data.length} rows`)
    }

    console.log('✅ Phase 2 data inserted\n')

    // Update Phase 2 assessment_periods metadata
    console.log('📝 Updating Phase 2 assessment period...')
    const { error: periodError } = await supabase
      .from('assessment_periods')
      .upsert({
        survey_wave: 'mar-2025-phase2',
        company_id: COMPANY_ID,
        name: 'Phase 2: Initial Implementation',
        description: 'Post-intervention assessment showing targeted improvements from A1 (Vision), B2 (Communication), C1 (Skills)',
        assessment_date: new Date('2025-03-01').toISOString(),
        status: 'active',
        interventions_applied: ['A1', 'B2', 'C1']
      }, {
        onConflict: 'company_id,survey_wave'
      })

    if (periodError) {
      throw new Error(`Failed to update assessment period: ${periodError.message}`)
    }

    console.log('✅ Phase 2 assessment period updated\n')

    // ═══════════════════════════════════════════════════════════
    // PHASE 3 GENERATION
    // ═══════════════════════════════════════════════════════════
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🚀 PHASE 3: Advanced Implementation (Nov 2025)')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    console.log('🎯 Interventions Applied: [A2, C3, D1]\n')
    console.log('   🔶 A2: AI Champions Network')
    console.log('      Category: Leadership')
    console.log('      Targets: L4_C2, L4_C5, L5_C2, L5_C5 (sentiment) + Organisation (capability)')
    console.log('      Impact: -0.35 resistance, +0.7 capability')
    console.log('      Timeframe: Short-term\n')
    console.log('   🔶 C3: Advanced AI Certification Program')
    console.log('      Category: Training')
    console.log('      Targets: L4_C2, L5_C2 (sentiment) + Talent & Innovation (capability)')
    console.log('      Impact: -0.3 resistance, +1.2 capability')
    console.log('      Timeframe: Medium-term\n')
    console.log('   🔶 D1: AI Governance Framework')
    console.log('      Category: Process')
    console.log('      Targets: All levels C3 (sentiment) + Ethics (capability)')
    console.log('      Impact: -0.4 resistance, +1.1 capability')
    console.log('      Timeframe: Medium-term\n')

    console.log('🔧 Generating Phase 3 data from Phase 2...')
    const phase3Data = generatePhase3FromPhase2(phase2Data, COMPANY_ID)
    console.log(`✅ Generated ${phase3Data.length} Phase 3 respondents\n`)

    // Validate Phase 3 data
    console.log('🔍 Validating Phase 3 data...')
    const phase3Validation = validateGeneratedData(phase3Data)

    if (!phase3Validation.valid) {
      console.error('❌ Phase 3 validation failed:')
      phase3Validation.errors.forEach(error => console.error(`   • ${error}`))
      throw new Error('Phase 3 data validation failed')
    }

    console.log('✅ Phase 3 validation passed\n')

    // Delete old Phase 3 data
    console.log('🗑️  Deleting old Phase 3 data...')
    const { error: delete3Error } = await supabase
      .from('respondents')
      .delete()
      .eq('survey_wave', 'nov-2025-phase3')
      .eq('company_id', COMPANY_ID)

    if (delete3Error) {
      throw new Error(`Failed to delete old Phase 3 data: ${delete3Error.message}`)
    }

    console.log('✅ Old Phase 3 data deleted\n')

    // Insert new Phase 3 data (batch insert in chunks)
    console.log('💾 Inserting new Phase 3 data...')
    for (let i = 0; i < phase3Data.length; i += chunkSize) {
      const chunk = phase3Data.slice(i, i + chunkSize)
      const { error: insert3Error } = await supabase
        .from('respondents')
        .insert(chunk)

      if (insert3Error) {
        throw new Error(`Failed to insert Phase 3 chunk ${i}: ${insert3Error.message}`)
      }
      console.log(`   ✓ Inserted ${Math.min(i + chunkSize, phase3Data.length)}/${phase3Data.length} rows`)
    }

    console.log('✅ Phase 3 data inserted\n')

    // Update Phase 3 assessment_periods metadata
    console.log('📝 Updating Phase 3 assessment period...')
    const { error: period3Error } = await supabase
      .from('assessment_periods')
      .upsert({
        survey_wave: 'nov-2025-phase3',
        company_id: COMPANY_ID,
        name: 'Phase 3: Advanced Implementation',
        description: 'Sustained improvements from A2 (Champions), C3 (Certification), D1 (Governance)',
        assessment_date: new Date('2025-11-01').toISOString(),
        status: 'active',
        interventions_applied: ['A1', 'A2', 'B2', 'C1', 'C3', 'D1']
      }, {
        onConflict: 'company_id,survey_wave'
      })

    if (period3Error) {
      throw new Error(`Failed to update Phase 3 assessment period: ${period3Error.message}`)
    }

    console.log('✅ Phase 3 assessment period updated\n')

    // ═══════════════════════════════════════════════════════════
    // FINAL SUMMARY
    // ═══════════════════════════════════════════════════════════
    console.log('\n')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🎉 SUCCESS! Complete intervention story generated')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    console.log('📊 DATA SUMMARY:')
    console.log(`   • Baseline: ${baselineData.length} respondents (Oct 2024)`)
    console.log(`   • Phase 2: ${phase2Data.length} respondents (Mar 2025)`)
    console.log(`   • Phase 3: ${phase3Data.length} respondents (Nov 2025)\n`)

    console.log('📖 INTERVENTION STORY:')
    console.log('   BASELINE → PHASE 2 (Interventions: A1, B2, C1)')
    console.log('      ✓ Executive Vision Workshops → Strategy improved')
    console.log('      ✓ Transparent Communication → Reduced resistance')
    console.log('      ✓ Skills Training → Talent capability boost\n')

    console.log('   PHASE 2 → PHASE 3 (Interventions: A2, C3, D1)')
    console.log('      ✓ AI Champions Network → Organization & leadership')
    console.log('      ✓ Advanced Certification → Innovation excellence')
    console.log('      ✓ Governance Framework → Ethics & control\n')

    console.log('✨ NEXT STEPS:')
    console.log('   1. Navigate to /assessment page')
    console.log('   2. Toggle between Baseline, Phase 2, Phase 3')
    console.log('   3. See green delta badges on targeted improvements')
    console.log('   4. Non-targeted areas show natural variance')
    console.log('   5. Complete intervention-based story!\n')

  } catch (error: any) {
    console.error('\n❌ ERROR:', error.message)
    console.error('\n💡 Troubleshooting:')
    console.error('   • Ensure baseline data exists (oct-2024-baseline)')
    console.error('   • Check Supabase credentials in .env.local')
    console.error('   • Verify database permissions\n')
    process.exit(1)
  }
}

// Run the script
regenerateAllPhases()
