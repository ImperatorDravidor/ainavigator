// Correct Sentiment Heatmap Calculation with Relative Ranking
// Based on Excel heatmap logic

import { SENTIMENT_LEVELS, SENTIMENT_CATEGORIES, SENTIMENT_COLUMN_MAPPING, COLOR_RANKING } from '../constants/sentiment-metadata'
import { FilterState } from '../types/assessment'

export interface SentimentCellData {
  levelId: number
  categoryId: number
  cellId: string
  score: number
  count: number
  rank: number  // 1 = highest, 25 = lowest
  ranking: number  // Alias for rank (for UI convenience)
  color: string
  levelName: string
  categoryName: string
  description: string
}

export interface SentimentStats {
  overallAverage: number
  standardDeviation: number
  totalRespondents: number
  rowAverages: number[]  // Average per level (5 totals)
  columnAverages: number[]  // Average per category (5 totals)
}

export function calculateSentimentHeatmap(
  data: any[],
  filters: FilterState = {}
): { cells: SentimentCellData[], stats: SentimentStats } {
  
  // Apply filters
  const filtered = filterData(data, filters)
  
  if (filtered.length === 0) {
    return {
      cells: [],
      stats: {
        overallAverage: 0,
        standardDeviation: 0,
        totalRespondents: 0,
        rowAverages: [0, 0, 0, 0, 0],
        columnAverages: [0, 0, 0, 0, 0]
      }
    }
  }
  
  // Calculate scores for all 25 cells
  const cellScores: { cellId: string, score: number, count: number }[] = []
  
  Object.entries(SENTIMENT_COLUMN_MAPPING).forEach(([cellId, columnName]) => {
    const scores = filtered
      .map(row => {
        const rawScore = row[columnName]
        if (typeof rawScore === 'number' && !isNaN(rawScore)) {
          // NO TRANSFORMATION - data is already on 1-3 scale
          // Raw data: 1.0 = low resistance (good), 3.0 = high resistance (concerning)
          // Display as-is where higher = MORE resistance (worse)
          return Math.max(1.0, Math.min(3.0, rawScore))
        }
        return null
      })
      .filter((score): score is number => score !== null)
    
    if (scores.length > 0) {
      const average = scores.reduce((sum, s) => sum + s, 0) / scores.length
      cellScores.push({ cellId, score: average, count: scores.length })
    } else {
      cellScores.push({ cellId, score: 0, count: 0 })
    }
  })

  // Get all valid scores for ranking - ASCENDING (lowest = least resistance = best)
  const allValidScores = cellScores
    .filter(c => c.count > 0)
    .map(c => c.score)
    .sort((a, b) => a - b) // ASCENDING - lowest scores = least resistance = best (rank #1)

  // Calculate color based on relative ranking
  const cells: SentimentCellData[] = cellScores.map((cell, index) => {
    const [levelStr, categoryStr] = cell.cellId.split('_')
    const levelId = parseInt(levelStr.replace('L', ''))
    const categoryId = parseInt(categoryStr.replace('C', ''))

    const level = SENTIMENT_LEVELS[levelId - 1]
    const category = SENTIMENT_CATEGORIES[categoryId - 1]

    // Determine rank (1 = LOWEST score = LEAST resistance = BEST)
    // Rank 25 = HIGHEST score = MOST resistance = WORST
    const rank = cell.count > 0
      ? allValidScores.findIndex(s => Math.abs(s - cell.score) < 0.001) + 1
      : 99

    // Determine color - ABSOLUTE THRESHOLDS based on 1-3 resistance scale
    // 1.0-1.4: LOW resistance = DARK GREEN (excellent)
    // 1.4-1.8: MODERATE resistance = LIGHT GREEN (good)
    // 1.8-2.2: ELEVATED resistance = YELLOW (needs attention)
    // 2.2-2.6: HIGH resistance = ORANGE (concerning)
    // 2.6-3.0: CRITICAL resistance = RED (urgent action needed)
    let color: string = COLOR_RANKING.NO_DATA
    if (cell.count > 0) {
      const score = cell.score
      if (score >= 2.6) {
        color = COLOR_RANKING.BOTTOM_3 // Dark red - Critical resistance
      } else if (score >= 2.2) {
        color = COLOR_RANKING.BOTTOM_8 // Orange - High resistance
      } else if (score >= 1.8) {
        color = COLOR_RANKING.MIDDLE // Yellow - Elevated resistance
      } else if (score >= 1.4) {
        color = COLOR_RANKING.TOP_8 // Light green - Moderate (good)
      } else {
        color = COLOR_RANKING.TOP_3 // Dark green - Low resistance (excellent)
      }
    }
    
    return {
      levelId,
      categoryId,
      cellId: cell.cellId,
      score: cell.score,
      count: cell.count,
      rank,
      ranking: rank,  // Alias for UI convenience
      color,
      levelName: level?.name || '',
      categoryName: category?.name || '',
      description: `${level?.name} × ${category?.name}: ${level?.description}`
    }
  })
  
  // Calculate statistics
  const validScores = cells.filter(c => c.count > 0).map(c => c.score)
  const overallAverage = validScores.length > 0
    ? validScores.reduce((sum, s) => sum + s, 0) / validScores.length
    : 0
  
  const variance = validScores.length > 0
    ? validScores.reduce((sum, s) => sum + Math.pow(s - overallAverage, 2), 0) / validScores.length
    : 0
  const standardDeviation = Math.sqrt(variance)
  
  // Row averages (per level)
  const rowAverages = SENTIMENT_LEVELS.map((_, levelIdx) => {
    const levelCells = cells.filter(c => c.levelId === levelIdx + 1 && c.count > 0)
    if (levelCells.length === 0) return 0
    return levelCells.reduce((sum, c) => sum + c.score, 0) / levelCells.length
  })
  
  // Column averages (per category)
  const columnAverages = SENTIMENT_CATEGORIES.map((_, catIdx) => {
    const categoryCells = cells.filter(c => c.categoryId === catIdx + 1 && c.count > 0)
    if (categoryCells.length === 0) return 0
    return categoryCells.reduce((sum, c) => sum + c.score, 0) / categoryCells.length
  })
  
  return {
    cells,
    stats: {
      overallAverage,
      standardDeviation,
      totalRespondents: filtered.length,
      rowAverages,
      columnAverages
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

// Get cells with HIGHEST resistance scores (problem areas - need attention)
// Now returns cells with HIGHEST RANKS (rank 25, 24, 23... = worst areas)
// Raw scores: 1.0 = low resistance, 3.0 = high resistance
export function getLowestScoringCells(
  cells: SentimentCellData[],
  count: number = 5
): SentimentCellData[] {
  return cells
    .filter(c => c.count > 0)
    .sort((a, b) => b.rank - a.rank) // Sort by rank DESCENDING - highest ranks (25, 24...) = worst areas
    .slice(0, count)
}

// Get cells with LOWEST resistance scores (strengths - least concern)
// Now returns cells with LOWEST RANKS (rank 1, 2, 3... = best areas)
// Raw scores: lowest scores = least resistance = strengths
export function getHighestScoringCells(
  cells: SentimentCellData[],
  count: number = 5
): SentimentCellData[] {
  return cells
    .filter(c => c.count > 0)
    .sort((a, b) => a.rank - b.rank) // Sort by rank ASCENDING - lowest ranks (1, 2, 3...) = best areas
    .slice(0, count)
}

