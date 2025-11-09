import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * POST /api/data/import-snapshot
 *
 * Import a new assessment snapshot with sentiment and capability data
 * Creates a new assessment period and imports CSV data
 *
 * FormData fields:
 * - snapshotName: string (required) - Display name for the assessment
 * - assessmentDate: string (required) - Date in YYYY-MM-DD format
 * - description: string (optional)
 * - sentimentFile: File (required) - CSV file with sentiment data
 * - capabilityFile: File (required) - CSV file with capability data
 *
 * Headers:
 * - x-company-id: Company identifier (required)
 */
export async function POST(request: NextRequest) {
  try {
    const companyId = request.headers.get('x-company-id')

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID required in x-company-id header' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const snapshotName = formData.get('snapshotName') as string
    const assessmentDate = formData.get('assessmentDate') as string
    const description = formData.get('description') as string || ''
    const sentimentFile = formData.get('sentimentFile') as File
    const capabilityFile = formData.get('capabilityFile') as File

    if (!snapshotName || !assessmentDate || !sentimentFile || !capabilityFile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate survey wave ID from date
    const date = new Date(assessmentDate)
    const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
    const surveyWave = `${monthNames[date.getMonth()]}-${date.getFullYear()}`

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if survey wave already exists
    const { data: existingPeriod } = await supabase
      .from('assessment_periods')
      .select('id')
      .eq('company_id', companyId)
      .eq('survey_wave', surveyWave)
      .single()

    if (existingPeriod) {
      return NextResponse.json(
        { error: 'An assessment period already exists for this date' },
        { status: 400 }
      )
    }

    // Parse CSV files
    const sentimentText = await sentimentFile.text()
    const capabilityText = await capabilityFile.text()

    const sentimentData = parseCSV(sentimentText)
    const capabilityData = parseCSV(capabilityText)

    if (sentimentData.length === 0 || capabilityData.length === 0) {
      return NextResponse.json(
        { error: 'CSV files are empty or invalid' },
        { status: 400 }
      )
    }

    // Create assessment period
    const { data: period, error: periodError } = await supabase
      .from('assessment_periods')
      .insert({
        company_id: companyId,
        survey_wave: surveyWave,
        assessment_date: assessmentDate,
        name: snapshotName,
        description,
        interventions_applied: [],
        status: 'active'
      })
      .select()
      .single()

    if (periodError) {
      console.error('Error creating assessment period:', periodError)
      return NextResponse.json(
        { error: 'Failed to create assessment period' },
        { status: 500 }
      )
    }

    // Import sentiment data
    const sentimentRecords = sentimentData.map(row => ({
      company_id: companyId,
      respondent_id: row.RespondentID || row.respondent_id,
      region: row.Region,
      department: row.Department,
      employment_type: row.EmploymentType,
      age: row.Age,
      user_language: row.UserLanguage,
      industry: row.Industry,
      continent: row.Continent,
      survey_wave: surveyWave,
      assessment_date: assessmentDate,
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
      sentiment_25: parseFloat(row.sentiment_25),
      q39_achievements: row.q39_achievements,
      q40_challenges: row.q40_challenges,
      q41_future_goals: row.q41_future_goals
    }))

    // Batch insert sentiment data (Supabase has a limit, so chunk it)
    const sentimentChunks = chunkArray(sentimentRecords, 500)
    for (const chunk of sentimentChunks) {
      const { error: sentimentError } = await supabase
        .from('respondents')
        .insert(chunk)

      if (sentimentError) {
        console.error('Error inserting sentiment data:', sentimentError)
        // Roll back: delete the assessment period
        await supabase.from('assessment_periods').delete().eq('id', period.id)
        return NextResponse.json(
          { error: 'Failed to import sentiment data' },
          { status: 500 }
        )
      }
    }

    // Import capability data
    const capabilityRecords = capabilityData.map(row => ({
      company_id: companyId,
      respondent_id: row.respondent_id,
      dimension_id: parseInt(row.dimension_id),
      dimension: row.dimension,
      construct_id: parseInt(row.construct_id),
      construct: row.construct,
      score: parseFloat(row.score),
      industry_synthetic: row.industry_synthetic,
      country_synthetic: row.country_synthetic,
      continent_synthetic: row.continent_synthetic,
      role_synthetic: row.role_synthetic,
      survey_wave: surveyWave,
      assessment_date: assessmentDate
    }))

    const capabilityChunks = chunkArray(capabilityRecords, 500)
    for (const chunk of capabilityChunks) {
      const { error: capabilityError } = await supabase
        .from('capability_scores')
        .insert(chunk)

      if (capabilityError) {
        console.error('Error inserting capability data:', capabilityError)
        // Roll back
        await supabase.from('respondents').delete().eq('survey_wave', surveyWave).eq('company_id', companyId)
        await supabase.from('assessment_periods').delete().eq('id', period.id)
        return NextResponse.json(
          { error: 'Failed to import capability data' },
          { status: 500 }
        )
      }
    }

    // Update respondent counts
    const sentimentCount = sentimentRecords.length
    const capabilityCount = new Set(capabilityRecords.map(r => r.respondent_id)).size

    await supabase
      .from('assessment_periods')
      .update({
        sentiment_respondents: sentimentCount,
        capability_respondents: capabilityCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', period.id)

    return NextResponse.json({
      success: true,
      data: {
        period,
        counts: {
          sentiment: sentimentCount,
          capability: capabilityCount
        }
      }
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Parse CSV text into array of objects
 */
function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map(h => h.trim())
  const data: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const values = line.split(',').map(v => v.trim())
    const row: Record<string, string> = {}

    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })

    data.push(row)
  }

  return data
}

/**
 * Split array into chunks
 */
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

