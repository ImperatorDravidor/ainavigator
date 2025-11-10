/**
 * Generate November 2024 CSV files with improved scores for testing
 *
 * This script creates sentiment and capability CSV files that show 8-12% improvement
 * over the October 2024 baseline, simulating the effect of applied interventions.
 *
 * Usage: npx tsx scripts/generate-november-csv.ts
 */

import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'
import { join } from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function generateNovemberCSVs() {
  console.log('📊 Generating November 2024 CSV files with improved scores...\n')

  // Fetch October baseline data
  const { data: octoberSentiment, error: sentimentError } = await supabase
    .from('respondents')
    .select('*')
    .eq('survey_wave', 'oct-2024-baseline')
    .limit(1000) // Sample 1000 for the demo

  if (sentimentError) {
    console.error('Error fetching sentiment data:', sentimentError)
    return
  }

  const { data: octoberCapability, error: capabilityError } = await supabase
    .from('capability_scores')
    .select('*')
    .eq('survey_wave', 'oct-2024-baseline')

  if (capabilityError) {
    console.error('Error fetching capability data:', capabilityError)
    return
  }

  console.log(`✓ Loaded ${octoberSentiment?.length} sentiment responses`)
  console.log(`✓ Loaded ${octoberCapability?.length} capability scores\n`)

  // Generate improved sentiment CSV
  const sentimentHeader = [
    'RespondentID', 'Region', 'Department', 'Employment_type', 'Age', 'UserLanguage',
    ...Array.from({ length: 25 }, (_, i) => `Sentiment_${i + 1}`)
  ].join(',')

  const sentimentRows = octoberSentiment!.map(row => {
    const improvementFactor = 0.88 + Math.random() * 0.04 // 8-12% improvement (lower scores = better)
    const sentimentValues = Array.from({ length: 25 }, (_, i) => {
      const original = parseFloat(row[`sentiment_${i + 1}`] || '2.5')
      const improved = Math.max(1.0, original * improvementFactor)
      return improved.toFixed(2)
    })

    return [
      `NOV_${row.respondent_id}`,
      row.region || '',
      row.department || '',
      row.employment_type || '',
      row.age || '',
      row.user_language || 'en',
      ...sentimentValues
    ].join(',')
  })

  const sentimentCSV = [sentimentHeader, ...sentimentRows].join('\n')
  const sentimentPath = join(process.cwd(), 'data-foundation', 'november_2024_sentiment.csv')
  writeFileSync(sentimentPath, sentimentCSV)
  console.log(`✓ Generated sentiment CSV: ${sentimentPath}`)
  console.log(`  - ${sentimentRows.length} rows`)
  console.log(`  - 8-12% improvement in scores (lower = better)\n`)

  // Generate improved capability CSV
  const capabilityHeader = [
    'respondent_id', 'dimension_id', 'dimension', 'construct_id', 'construct', 'score'
  ].join(',')

  const capabilityRows = octoberCapability!.map(row => {
    const improvementFactor = 1.10 + Math.random() * 0.05 // 10-15% improvement
    const improved = Math.min(7.0, parseFloat(row.score) * improvementFactor)

    return [
      `NOV_${row.respondent_id}`,
      row.dimension_id,
      row.dimension,
      row.construct_id,
      row.construct,
      improved.toFixed(2)
    ].join(',')
  })

  const capabilityCSV = [capabilityHeader, ...capabilityRows].join('\n')
  const capabilityPath = join(process.cwd(), 'data-foundation', 'november_2024_capability.csv')
  writeFileSync(capabilityPath, capabilityCSV)
  console.log(`✓ Generated capability CSV: ${capabilityPath}`)
  console.log(`  - ${capabilityRows.length} rows`)
  console.log(`  - 10-15% improvement in scores (capped at 7.0)\n`)

  console.log('🎉 CSV files generated successfully!')
  console.log('\nNext steps:')
  console.log('1. Open the app and click the Timeline Selector')
  console.log('2. Click "+ Upload New Assessment Data"')
  console.log('3. Fill in:')
  console.log('   - Period Name: "November 2024 - Post-Intervention"')
  console.log('   - Assessment Date: 2024-11-01')
  console.log('4. Select interventions (e.g., A1, B2, B3)')
  console.log('5. Upload both CSV files')
  console.log('6. Compare October vs November data!')
}

generateNovemberCSVs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error)
    process.exit(1)
  })
