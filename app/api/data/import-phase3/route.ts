import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * POST /api/data/import-phase3
 * 
 * Import Phase 3 data from single JSON file
 */
export async function POST(request: NextRequest) {
  try {
    const companyId = request.headers.get('x-company-id')
    if (!companyId) {
      return NextResponse.json({ error: 'Company ID required' }, { status: 401 })
    }

    const data = await request.json()
    const { metadata, sentiment_data, capability_data } = data

    if (!sentiment_data || !capability_data) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Insert sentiment data
    const sentimentRecords = sentiment_data.map((row: any) => ({
      ...row,
      company_id: companyId,
      survey_wave: 'nov-2025-phase3',
      assessment_date: metadata.assessment_date
    }))
    
    const { error: sentError } = await supabase
      .from('respondents')
      .insert(sentimentRecords)
      
    if (sentError) {
      console.error('Sentiment insert error:', sentError)
      return NextResponse.json({ error: 'Failed to import sentiment data' }, { status: 500 })
    }
    
    // Insert capability data in batches
    for (let i = 0; i < capability_data.length; i += 500) {
      const batch = capability_data.slice(i, i + 500).map((row: any) => ({
        ...row,
        company_id: companyId,
        survey_wave: 'nov-2025-phase3',
        assessment_date: metadata.assessment_date
      }))
      
      const { error: capError } = await supabase
        .from('capability_scores')
        .insert(batch)
        
      if (capError) {
        console.error('Capability insert error:', capError)
        return NextResponse.json({ error: 'Failed to import capability data' }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Phase 3 imported successfully',
      counts: {
        sentiment: sentiment_data.length,
        capability: capability_data.length
      }
    })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

