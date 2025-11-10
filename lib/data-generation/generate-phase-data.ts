/**
 * Intervention-Based Phase Data Generation
 *
 * Generates realistic phase progression data by:
 * 1. Applying MAJOR improvements to intervention-targeted areas
 * 2. Applying natural variance (standard deviation) to non-targeted areas
 * 3. Maintaining data integrity and realistic progression
 */

import {
  INTERVENTIONS,
  INTERVENTION_CELL_MAPPING,
  calculateNaturalVariance,
  isCellTargeted,
  isDimensionTargeted
} from '@/lib/constants/interventions'

// Sentiment column mapping (1-3 scale)
const SENTIMENT_COLUMN_MAPPING: Record<string, string> = {
  'L1_C1': 'sentiment_1',
  'L1_C2': 'sentiment_2',
  'L1_C3': 'sentiment_3',
  'L1_C4': 'sentiment_4',
  'L1_C5': 'sentiment_5',
  'L2_C1': 'sentiment_6',
  'L2_C2': 'sentiment_7',
  'L2_C3': 'sentiment_8',
  'L2_C4': 'sentiment_9',
  'L2_C5': 'sentiment_10',
  'L3_C1': 'sentiment_11',
  'L3_C2': 'sentiment_12',
  'L3_C3': 'sentiment_13',
  'L3_C4': 'sentiment_14',
  'L3_C5': 'sentiment_15',
  'L4_C1': 'sentiment_16',
  'L4_C2': 'sentiment_17',
  'L4_C3': 'sentiment_18',
  'L4_C4': 'sentiment_19',
  'L4_C5': 'sentiment_20',
  'L5_C1': 'sentiment_21',
  'L5_C2': 'sentiment_22',
  'L5_C3': 'sentiment_23',
  'L5_C4': 'sentiment_24',
  'L5_C5': 'sentiment_25'
}

// Capability dimension to construct column mapping
const CAPABILITY_CONSTRUCTS: Record<number, string[]> = {
  1: ['dim1_construct1', 'dim1_construct2', 'dim1_construct3', 'dim1_construct4'], // Strategy & Vision
  2: ['dim2_construct1', 'dim2_construct2', 'dim2_construct3', 'dim2_construct4'], // Data
  3: ['dim3_construct1', 'dim3_construct2', 'dim3_construct3', 'dim3_construct4'], // Technology
  4: ['dim4_construct1', 'dim4_construct2', 'dim4_construct3', 'dim4_construct4'], // Talent & Skills
  5: ['dim5_construct1', 'dim5_construct2', 'dim5_construct3', 'dim5_construct4'], // Organisation
  6: ['dim6_construct1', 'dim6_construct2', 'dim6_construct3', 'dim6_construct4'], // Innovation
  7: ['dim7_construct1', 'dim7_construct2', 'dim7_construct3', 'dim7_construct4'], // Adaptation
  8: ['dim8_construct1', 'dim8_construct2', 'dim8_construct3', 'dim8_construct4']  // Ethics
}

export interface PhaseGenerationConfig {
  baselineData: any[]
  appliedInterventions: string[] // e.g., ['A1', 'B2', 'C1']
  surveyWave: string // e.g., 'mar-2025-phase2'
  assessmentDate: Date
  companyId: string
}

/**
 * Generate phase data from baseline using intervention-based improvements
 */
export function generatePhaseData(config: PhaseGenerationConfig): any[] {
  const { baselineData, appliedInterventions, surveyWave, assessmentDate, companyId } = config

  return baselineData.map((respondent, index) => {
    const updatedRespondent = { ...respondent }

    // 1. Apply sentiment improvements (targeted cells only)
    applySentimentImprovements(updatedRespondent, appliedInterventions)

    // 2. Apply capability improvements (targeted dimensions only)
    applyCapabilityImprovements(updatedRespondent, appliedInterventions)

    // 3. Apply natural variance to non-targeted areas
    applyNaturalVariance(updatedRespondent, appliedInterventions)

    // 4. Update metadata - remove id and respondent_id (they will be auto-generated or we'll create new ones)
    const { id, respondent_id, ...respondentData } = updatedRespondent

    // Generate new respondent_id based on survey wave to avoid conflicts
    const newRespondentId = `${surveyWave}-${String(index + 1).padStart(4, '0')}`

    return {
      ...respondentData,
      respondent_id: newRespondentId,
      survey_wave: surveyWave,
      company_id: companyId,
      assessment_date: assessmentDate.toISOString()
    }
  })
}

/**
 * Apply MAJOR improvements to sentiment cells targeted by interventions
 */
function applySentimentImprovements(respondent: any, appliedInterventions: string[]): void {
  appliedInterventions.forEach(code => {
    const intervention = INTERVENTIONS[code]
    if (!intervention.targets.sentimentLevels || !intervention.targets.sentimentCategories) {
      return
    }

    // For each targeted cell
    intervention.targets.sentimentLevels.forEach(level => {
      intervention.targets.sentimentCategories!.forEach(category => {
        const cellId = `L${level}_C${category}`
        const columnName = SENTIMENT_COLUMN_MAPPING[cellId]

        if (columnName && respondent[columnName] !== null && respondent[columnName] !== undefined) {
          // Apply reduction with some randomness (±10% variance)
          const baseReduction = intervention.impact.sentimentReduction
          const variance = baseReduction * (Math.random() * 0.2 - 0.1) // ±10%
          const totalReduction = baseReduction + variance

          // Apply improvement (reduction = lower resistance = better)
          const newValue = respondent[columnName] + totalReduction

          // Clamp to valid range (1.0 - 3.0)
          respondent[columnName] = Math.max(1.0, Math.min(3.0, newValue))
        }
      })
    })
  })
}

/**
 * Apply MAJOR improvements to capability dimensions targeted by interventions
 */
function applyCapabilityImprovements(respondent: any, appliedInterventions: string[]): void {
  appliedInterventions.forEach(code => {
    const intervention = INTERVENTIONS[code]
    if (!intervention.targets.capabilityDimensions) {
      return
    }

    // For each targeted dimension
    intervention.targets.capabilityDimensions.forEach(dimId => {
      const constructs = CAPABILITY_CONSTRUCTS[dimId]
      if (!constructs) return

      // Apply increase with some randomness (±10% variance)
      const baseIncrease = intervention.impact.capabilityIncrease
      const variance = baseIncrease * (Math.random() * 0.2 - 0.1) // ±10%
      const totalIncrease = baseIncrease + variance

      // Apply to all constructs in this dimension
      constructs.forEach(constructColumn => {
        if (respondent[constructColumn] !== null && respondent[constructColumn] !== undefined) {
          const newValue = respondent[constructColumn] + totalIncrease

          // Clamp to valid range (1.0 - 7.0)
          respondent[constructColumn] = Math.max(1.0, Math.min(7.0, newValue))
        }
      })
    })
  })
}

/**
 * Apply natural variance (standard deviation) to non-targeted areas
 */
function applyNaturalVariance(respondent: any, appliedInterventions: string[]): void {
  // Apply to sentiment cells that are NOT targeted
  Object.entries(SENTIMENT_COLUMN_MAPPING).forEach(([cellId, columnName]) => {
    const isTargeted = isCellTargeted(cellId, appliedInterventions)

    if (!isTargeted && respondent[columnName] !== null && respondent[columnName] !== undefined) {
      const variance = calculateNaturalVariance('sentiment')
      const newValue = respondent[columnName] + variance

      // Clamp to valid range (1.0 - 3.0)
      respondent[columnName] = Math.max(1.0, Math.min(3.0, newValue))
    }
  })

  // Apply to capability constructs that are NOT targeted
  Object.entries(CAPABILITY_CONSTRUCTS).forEach(([dimId, constructs]) => {
    const isTargeted = isDimensionTargeted(parseInt(dimId), appliedInterventions)

    if (!isTargeted) {
      constructs.forEach(constructColumn => {
        if (respondent[constructColumn] !== null && respondent[constructColumn] !== undefined) {
          const variance = calculateNaturalVariance('capability')
          const newValue = respondent[constructColumn] + variance

          // Clamp to valid range (1.0 - 7.0)
          respondent[constructColumn] = Math.max(1.0, Math.min(7.0, newValue))
        }
      })
    }
  })
}

/**
 * Generate Phase 2 specifically (from Baseline with interventions A1, B2, C1)
 */
export function generatePhase2FromBaseline(baselineData: any[], companyId: string): any[] {
  return generatePhaseData({
    baselineData,
    appliedInterventions: ['A1', 'B2', 'C1'],
    surveyWave: 'mar-2025-phase2',
    assessmentDate: new Date('2025-03-01'),
    companyId
  })
}

/**
 * Generate Phase 3 specifically (from Phase 2 with interventions A2, C3, D1)
 */
export function generatePhase3FromPhase2(phase2Data: any[], companyId: string): any[] {
  return generatePhaseData({
    baselineData: phase2Data,
    appliedInterventions: ['A2', 'C3', 'D1'],
    surveyWave: 'nov-2025-phase3',
    assessmentDate: new Date('2025-11-01'),
    companyId
  })
}

/**
 * Validate generated data quality
 */
export function validateGeneratedData(data: any[]): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (data.length === 0) {
    errors.push('Generated data is empty')
  }

  // Check random sample for data integrity
  const sample = data[Math.floor(Math.random() * data.length)]

  // Validate sentiment values (1.0 - 3.0)
  Object.entries(SENTIMENT_COLUMN_MAPPING).forEach(([cellId, columnName]) => {
    const value = sample[columnName]
    if (value !== null && value !== undefined) {
      if (value < 1.0 || value > 3.0) {
        errors.push(`Sentiment value out of range for ${cellId}: ${value}`)
      }
    }
  })

  // Validate capability values (1.0 - 7.0)
  Object.values(CAPABILITY_CONSTRUCTS).flat().forEach(constructColumn => {
    const value = sample[constructColumn]
    if (value !== null && value !== undefined) {
      if (value < 1.0 || value > 7.0) {
        errors.push(`Capability value out of range for ${constructColumn}: ${value}`)
      }
    }
  })

  return {
    valid: errors.length === 0,
    errors
  }
}
