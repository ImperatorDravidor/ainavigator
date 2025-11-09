// Correct Capability Assessment Calculation
// Based on Excel capability scan logic

import { CAPABILITY_DIMENSIONS, CAPABILITY_CONSTRUCTS } from '../constants/capability-metadata'
import { FilterState } from '../types/assessment'

export interface DimensionScore {
  dimensionId: number
  name: string
  description: string
  average: number
  max: number
  min: number
  spread: number
  benchmark: number
  status: 'above' | 'at' | 'below' | 'significantly_below'
  constructs: ConstructScore[]
  count: number // Number of respondents who answered questions in this dimension
}

export interface ConstructScore {
  constructId: number
  name: string
  score: number
  benchmark?: number
  questionText?: string
}

export interface CapabilityOverview {
  dimensions: DimensionScore[]
  overall: {
    average: number
    highest: DimensionScore
    lowest: DimensionScore
    biggestGap: DimensionScore
  }
}

// TODO: This needs actual capability data - currently we don't have it loaded
// The data structure should have construct scores like:
// { RespondentID, Region, Department, ..., construct_1, construct_2, ..., construct_32, open_response_1, ... }

export function calculateCapabilityAssessment(
  data: any[],
  benchmarks: Record<number, number>, // dimensionId → benchmark score
  filters: FilterState = {}
): CapabilityOverview {
  
  const filtered = filterData(data, filters)
  
  if (filtered.length === 0) {
    return {
      dimensions: [],
      overall: {
        average: 0,
        highest: null as any,
        lowest: null as any,
        biggestGap: null as any
      }
    }
  }
  
  const dimensions: DimensionScore[] = CAPABILITY_DIMENSIONS.map(dim => {
    const constructs = CAPABILITY_CONSTRUCTS.filter(c => c.dimensionId === dim.id)
    
    const constructScores: ConstructScore[] = constructs.map(construct => {
      // Get scores for this construct from all respondents
      const columnName = `construct_${construct.id}` // Assuming data has construct_1, construct_2, etc.
      const scores = filtered
        .map(row => row[columnName])
        .filter((score): score is number => typeof score === 'number' && !isNaN(score))
      
      const average = scores.length > 0
        ? scores.reduce((sum, s) => sum + s, 0) / scores.length
        : 0
      
      return {
        constructId: construct.id,
        name: construct.name,
        score: average,
        benchmark: undefined // TODO: Add construct-level benchmarks
      }
    })
    
    // Calculate dimension averages from constructs
    const validConstructScores = constructScores
      .map(c => c.score)
      .filter(s => s > 0)
    
    const average = validConstructScores.length > 0
      ? validConstructScores.reduce((sum, s) => sum + s, 0) / validConstructScores.length
      : 0
    
    const max = validConstructScores.length > 0 ? Math.max(...validConstructScores) : 0
    const min = validConstructScores.length > 0 ? Math.min(...validConstructScores) : 0
    const spread = max - min
    
    const benchmark = benchmarks[dim.id] || 0
    
    // Determine status (scale: 1-7, where 7 is highest maturity)
    // Thresholds adjusted for 1-7 scale: 0.3 ≈ 4%, 0.7 ≈ 10%, 1.0 ≈ 14%
    let status: 'above' | 'at' | 'below' | 'significantly_below' = 'at'
    const diff = average - benchmark
    if (diff > 0.3) status = 'above'  // More than 4% above benchmark
    else if (diff < -1.0) status = 'significantly_below'  // More than 14% below
    else if (diff < -0.3) status = 'below'  // More than 4% below
    
    return {
      dimensionId: dim.id,
      name: dim.name,
      description: dim.description,
      average,
      max,
      min,
      spread,
      benchmark,
      status,
      constructs: constructScores,
      count: filtered.length // Number of respondents in filtered data
    }
  })
  
  // Calculate overall statistics
  const validDimensions = dimensions.filter(d => d.average > 0)
  const overallAverage = validDimensions.length > 0
    ? validDimensions.reduce((sum, d) => sum + d.average, 0) / validDimensions.length
    : 0
  
  const highest = validDimensions.reduce((prev, curr) => 
    curr.average > prev.average ? curr : prev, validDimensions[0])
  
  const lowest = validDimensions.reduce((prev, curr) => 
    curr.average < prev.average ? curr : prev, validDimensions[0])
  
  const biggestGap = validDimensions.reduce((prev, curr) => 
    curr.spread > prev.spread ? curr : prev, validDimensions[0])
  
  return {
    dimensions,
    overall: {
      average: overallAverage,
      highest,
      lowest,
      biggestGap
    }
  }
}

function filterData(data: any[], filters: FilterState): any[] {
  return data.filter(row => {
    if (filters.region && row.Region !== filters.region) return false
    if (filters.department && row.Department !== filters.department) return false
    if (filters.role && row.Employment_type !== filters.role) return false
    if (filters.ageGroup && row.Age !== filters.ageGroup) return false
    return true
  })
}

// Get weakest dimensions for recommendations
export function getWeakestDimensions(
  dimensions: DimensionScore[],
  count: number = 3
): DimensionScore[] {
  return dimensions
    .filter(d => d.average > 0)
    .sort((a, b) => {
      // Sort by gap from benchmark first, then by absolute score
      const gapA = a.average - a.benchmark
      const gapB = b.average - b.benchmark
      return gapA - gapB
    })
    .slice(0, count)
}

// Get weakest constructs across all dimensions
export function getWeakestConstructs(
  dimensions: DimensionScore[],
  count: number = 5
): Array<ConstructScore & { dimensionName: string }> {
  const allConstructs = dimensions.flatMap(dim =>
    dim.constructs.map(c => ({
      ...c,
      dimensionName: dim.name
    }))
  )
  
  return allConstructs
    .filter(c => c.score > 0)
    .sort((a, b) => a.score - b.score)
    .slice(0, count)
}

