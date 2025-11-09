import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * GET /api/data/applied-interventions
 *
 * Returns list of interventions that have been applied/implemented
 * for a specific assessment period
 *
 * Query params:
 * - assessment_period_id: UUID of the assessment period
 *
 * Headers:
 * - x-company-id: Company identifier (required)
 */
export async function GET(request: NextRequest) {
  try {
    const companyId = request.headers.get('x-company-id')

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID required in x-company-id header' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const assessmentPeriodId = searchParams.get('assessment_period_id')

    const supabase = createClient(supabaseUrl, supabaseKey)

    let query = supabase
      .from('applied_interventions')
      .select('*')
      .eq('company_id', companyId)
      .order('applied_date', { ascending: false })

    if (assessmentPeriodId) {
      query = query.eq('assessment_period_id', assessmentPeriodId)
    }

    const { data: appliedInterventions, error } = await query

    if (error) {
      console.error('Supabase error fetching applied interventions:', error)
      return NextResponse.json(
        { error: 'Failed to fetch applied interventions' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: appliedInterventions || [],
      metadata: {
        total: appliedInterventions?.length || 0,
        companyId,
        assessmentPeriodId
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
 * POST /api/data/applied-interventions
 *
 * Mark an intervention as applied/implemented for an assessment period
 *
 * Body:
 * - assessment_period_id: UUID (required)
 * - intervention_code: string (required) - e.g., 'A1', 'B2'
 * - applied_date: string (required) - YYYY-MM-DD format
 * - status: 'planned' | 'in_progress' | 'completed' | 'abandoned' (optional, defaults to 'completed')
 * - notes: string (optional)
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

    const body = await request.json()
    const {
      assessment_period_id,
      intervention_code,
      applied_date,
      status = 'completed',
      notes
    } = body

    if (!assessment_period_id || !intervention_code || !applied_date) {
      return NextResponse.json(
        { error: 'assessment_period_id, intervention_code, and applied_date are required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Insert the applied intervention
    const { data: appliedIntervention, error } = await supabase
      .from('applied_interventions')
      .insert({
        company_id: companyId,
        assessment_period_id,
        intervention_code,
        applied_date,
        status,
        notes
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error creating applied intervention:', error)
      return NextResponse.json(
        { error: 'Failed to create applied intervention' },
        { status: 500 }
      )
    }

    // Update the assessment period's interventions_applied array
    const { data: period } = await supabase
      .from('assessment_periods')
      .select('interventions_applied')
      .eq('id', assessment_period_id)
      .single()

    if (period) {
      const currentInterventions = period.interventions_applied || []
      if (!currentInterventions.includes(intervention_code)) {
        await supabase
          .from('assessment_periods')
          .update({
            interventions_applied: [...currentInterventions, intervention_code],
            updated_at: new Date().toISOString()
          })
          .eq('id', assessment_period_id)
      }
    }

    return NextResponse.json({
      success: true,
      data: appliedIntervention
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
 * DELETE /api/data/applied-interventions
 *
 * Remove an applied intervention record
 *
 * Query params:
 * - id: UUID of the applied_intervention record
 */
export async function DELETE(request: NextRequest) {
  try {
    const companyId = request.headers.get('x-company-id')

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID required in x-company-id header' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'id parameter is required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get the record first to update assessment_periods
    const { data: appliedIntervention } = await supabase
      .from('applied_interventions')
      .select('*')
      .eq('id', id)
      .eq('company_id', companyId)
      .single()

    if (!appliedIntervention) {
      return NextResponse.json(
        { error: 'Applied intervention not found' },
        { status: 404 }
      )
    }

    // Delete the record
    const { error } = await supabase
      .from('applied_interventions')
      .delete()
      .eq('id', id)
      .eq('company_id', companyId)

    if (error) {
      console.error('Supabase error deleting applied intervention:', error)
      return NextResponse.json(
        { error: 'Failed to delete applied intervention' },
        { status: 500 }
      )
    }

    // Update the assessment period's interventions_applied array
    const { data: period } = await supabase
      .from('assessment_periods')
      .select('interventions_applied')
      .eq('id', appliedIntervention.assessment_period_id)
      .single()

    if (period) {
      const currentInterventions = period.interventions_applied || []
      const updatedInterventions = currentInterventions.filter(
        (code: string) => code !== appliedIntervention.intervention_code
      )
      
      await supabase
        .from('assessment_periods')
        .update({
          interventions_applied: updatedInterventions,
          updated_at: new Date().toISOString()
        })
        .eq('id', appliedIntervention.assessment_period_id)
    }

    return NextResponse.json({
      success: true,
      message: 'Applied intervention removed'
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

