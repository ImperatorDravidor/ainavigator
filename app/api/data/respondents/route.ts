import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(request: NextRequest) {
  try {
    const companyId = request.headers.get('x-company-id')

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID required' },
        { status: 401 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch all respondents for this company
    const { data: respondents, error } = await supabase
      .from('respondents')
      .select('*')
      .eq('company_id', companyId)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch data' },
        { status: 500 }
      )
    }

    // Transform to match existing data structure
    const transformedData = respondents.map(r => ({
      id: r.id,
      responseId: r.respondent_id,
      region: r.region,
      department: r.department,
      role: r.employment_type,
      ageGroup: r.age,
      userLanguage: r.user_language,
      // Sentiment scores
      sentimentScores: {
        sentiment_1: r.sentiment_1,
        sentiment_2: r.sentiment_2,
        sentiment_3: r.sentiment_3,
        sentiment_4: r.sentiment_4,
        sentiment_5: r.sentiment_5,
        sentiment_6: r.sentiment_6,
        sentiment_7: r.sentiment_7,
        sentiment_8: r.sentiment_8,
        sentiment_9: r.sentiment_9,
        sentiment_10: r.sentiment_10,
        sentiment_11: r.sentiment_11,
        sentiment_12: r.sentiment_12,
        sentiment_13: r.sentiment_13,
        sentiment_14: r.sentiment_14,
        sentiment_15: r.sentiment_15,
        sentiment_16: r.sentiment_16,
        sentiment_17: r.sentiment_17,
        sentiment_18: r.sentiment_18,
        sentiment_19: r.sentiment_19,
        sentiment_20: r.sentiment_20,
        sentiment_21: r.sentiment_21,
        sentiment_22: r.sentiment_22,
        sentiment_23: r.sentiment_23,
        sentiment_24: r.sentiment_24,
        sentiment_25: r.sentiment_25,
      },
      timestamp: r.created_at,
    }))

    return NextResponse.json({
      success: true,
      data: transformedData,
      count: transformedData.length,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

