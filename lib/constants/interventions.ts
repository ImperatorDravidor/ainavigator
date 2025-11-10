// Intervention Metadata and Impact Calculation System

export interface InterventionTarget {
  sentimentLevels?: number[]      // [1, 2] = Aware & Interested
  sentimentCategories?: number[]  // [3, 4] = Fear/Control & Unclear Value
  capabilityDimensions?: number[] // [1, 2] = Strategy & Vision, Data
}

export interface InterventionImpact {
  sentimentReduction: number      // -0.4 to -0.8 (MAJOR reduction in resistance)
  capabilityIncrease: number      // +0.8 to +1.5 (MAJOR increase in maturity)
  timeframe: 'immediate' | 'short-term' | 'medium-term'
  confidence: 'high' | 'medium' | 'low'
}

export interface Intervention {
  code: string
  category: 'Leadership' | 'Communication' | 'Training' | 'Process' | 'Culture' | 'Technology'
  name: string
  description: string
  targets: InterventionTarget
  impact: InterventionImpact
  effort: 'low' | 'medium' | 'high'
  cost: 'low' | 'medium' | 'high'
  prerequisites?: string[]
}

// Master intervention catalog
export const INTERVENTIONS: Record<string, Intervention> = {
  'A1': {
    code: 'A1',
    category: 'Leadership',
    name: 'Executive AI Vision Workshops',
    description: 'C-suite alignment sessions to develop clear AI strategy and communicate vision across organization',
    targets: {
      sentimentLevels: [1, 2],      // Aware & Interested
      sentimentCategories: [4],      // Unclear Value
      capabilityDimensions: [1]      // Strategy & Vision
    },
    impact: {
      sentimentReduction: -0.5,      // MAJOR: 2.3 → 1.8
      capabilityIncrease: 0.9,       // MAJOR: 3.9 → 4.8
      timeframe: 'medium-term',
      confidence: 'high'
    },
    effort: 'medium',
    cost: 'medium'
  },

  'B2': {
    code: 'B2',
    category: 'Communication',
    name: 'Transparent AI Roadmap Communication',
    description: 'Regular town halls, newsletters, and Q&A sessions about AI implementation plans and impacts',
    targets: {
      sentimentLevels: [2, 3],      // Interested & Willing
      sentimentCategories: [3, 4],   // Fear/Control & Unclear Value
    },
    impact: {
      sentimentReduction: -0.45,     // MAJOR: 2.2 → 1.75
      capabilityIncrease: 0,
      timeframe: 'immediate',
      confidence: 'high'
    },
    effort: 'low',
    cost: 'low'
  },

  'C1': {
    code: 'C1',
    category: 'Training',
    name: 'AI Skills Development Program',
    description: 'Comprehensive hands-on training for AI tools, prompting techniques, and practical applications',
    targets: {
      sentimentLevels: [2, 3, 4],   // Interested, Willing, Engaged
      sentimentCategories: [1, 2, 5], // Workload, Skill Gap, Career Concerns
      capabilityDimensions: [4]      // Talent & Skills
    },
    impact: {
      sentimentReduction: -0.4,      // MAJOR: 2.0 → 1.6
      capabilityIncrease: 1.0,       // MAJOR: 4.1 → 5.1
      timeframe: 'medium-term',
      confidence: 'high'
    },
    effort: 'high',
    cost: 'high'
  },

  'A2': {
    code: 'A2',
    category: 'Leadership',
    name: 'AI Champions Network',
    description: 'Empower department leaders and early adopters as AI advocates and peer mentors',
    targets: {
      sentimentLevels: [4, 5],      // Engaged & Advocating
      sentimentCategories: [2, 5],   // Skill Gap & Career Concerns
      capabilityDimensions: [5]      // Organization & Processes
    },
    impact: {
      sentimentReduction: -0.35,     // MAJOR: 2.0 → 1.65
      capabilityIncrease: 0.7,       // MAJOR: 4.5 → 5.2
      timeframe: 'short-term',
      confidence: 'medium'
    },
    effort: 'medium',
    cost: 'low'
  },

  'C3': {
    code: 'C3',
    category: 'Training',
    name: 'Advanced AI Certification Program',
    description: 'Deep technical training and certification for power users and AI specialists',
    targets: {
      sentimentLevels: [4, 5],       // Engaged & Advocating
      sentimentCategories: [2],       // Skill Gap
      capabilityDimensions: [4, 6]    // Talent & Innovation
    },
    impact: {
      sentimentReduction: -0.3,      // MAJOR: 1.8 → 1.5
      capabilityIncrease: 1.2,       // MAJOR: 5.1 → 6.3, 4.8 → 6.0
      timeframe: 'medium-term',
      confidence: 'high'
    },
    effort: 'high',
    cost: 'high',
    prerequisites: ['C1']
  },

  'D1': {
    code: 'D1',
    category: 'Process',
    name: 'AI Governance Framework',
    description: 'Establish clear policies, decision-making processes, and ethical guidelines',
    targets: {
      sentimentCategories: [3],      // Fear/Control
      capabilityDimensions: [8]      // Ethics & Responsibility
    },
    impact: {
      sentimentReduction: -0.4,      // MAJOR: 2.1 → 1.7
      capabilityIncrease: 1.1,       // MAJOR: 4.9 → 6.0
      timeframe: 'medium-term',
      confidence: 'high'
    },
    effort: 'high',
    cost: 'medium'
  },

  'E1': {
    code: 'E1',
    category: 'Technology',
    name: 'AI Infrastructure Upgrade',
    description: 'Invest in modern AI tools, platforms, and technical infrastructure',
    targets: {
      capabilityDimensions: [2, 3]   // Data & Technology
    },
    impact: {
      sentimentReduction: 0,
      capabilityIncrease: 1.3,       // MAJOR: 4.5 → 5.8
      timeframe: 'medium-term',
      confidence: 'high'
    },
    effort: 'high',
    cost: 'high'
  },

  'F1': {
    code: 'F1',
    category: 'Culture',
    name: 'Innovation Lab & Experimentation',
    description: 'Create safe space for AI experimentation and learning from failures',
    targets: {
      sentimentLevels: [3, 4, 5],    // Willing, Engaged, Advocating
      sentimentCategories: [1, 3],    // Workload & Fear/Control
      capabilityDimensions: [6, 7]    // Innovation & Adaptation
    },
    impact: {
      sentimentReduction: -0.35,     // MAJOR: 1.9 → 1.55
      capabilityIncrease: 0.8,       // MAJOR: 4.5 → 5.3
      timeframe: 'medium-term',
      confidence: 'medium'
    },
    effort: 'high',
    cost: 'medium'
  }
}

// Map of which cells each intervention targets
export const INTERVENTION_CELL_MAPPING: Record<string, string[]> = {
  'A1': ['L1_C4', 'L2_C4'],           // Aware/Interested × Unclear Value
  'B2': ['L2_C3', 'L2_C4', 'L3_C3', 'L3_C4'], // Interested/Willing × Fear/Unclear
  'C1': ['L2_C1', 'L2_C2', 'L2_C5', 'L3_C1', 'L3_C2', 'L3_C5', 'L4_C1', 'L4_C2', 'L4_C5'], // Multiple cells
  'A2': ['L4_C2', 'L4_C5', 'L5_C2', 'L5_C5'], // Engaged/Advocating × Skill/Career
  'C3': ['L4_C2', 'L5_C2'],           // Engaged/Advocating × Skill Gap
  'D1': ['L1_C3', 'L2_C3', 'L3_C3', 'L4_C3', 'L5_C3'], // All levels × Fear/Control
  'E1': [],                           // Capability only
  'F1': ['L3_C1', 'L3_C3', 'L4_C1', 'L4_C3', 'L5_C1', 'L5_C3'] // Willing+ × Workload/Fear
}

// Standard deviation for natural variance (applies to non-targeted cells)
export const NATURAL_VARIANCE = {
  sentiment: {
    mean: -0.03,      // Slight natural improvement (-0.03 resistance on average)
    stdDev: 0.05,     // ±0.05 standard deviation (small natural fluctuation)
    minChange: -0.12, // Max improvement (lower resistance)
    maxChange: 0.08   // Max regression (slightly higher resistance) - less likely
  },
  capability: {
    mean: 0.08,       // Slight natural improvement (+0.08 on average)
    stdDev: 0.08,     // ±0.08 standard deviation
    minChange: -0.05, // Small chance of slight regression
    maxChange: 0.25   // Cap at +0.25 improvement
  }
}

/**
 * Calculate natural variance for non-targeted data
 * Uses normal distribution with capped max change
 * Biased toward improvement to ensure progressive story
 */
export function calculateNaturalVariance(
  type: 'sentiment' | 'capability'
): number {
  const config = NATURAL_VARIANCE[type]

  // Box-Muller transform for normal distribution
  const u1 = Math.random()
  const u2 = Math.random()
  const standardNormal = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)

  // Scale by stdDev and add mean
  let variance = config.mean + standardNormal * config.stdDev

  // Cap at min/max change
  variance = Math.max(config.minChange, Math.min(config.maxChange, variance))

  return variance
}

/**
 * Check if a cell is targeted by any applied intervention
 */
export function isCellTargeted(
  cellId: string,
  appliedInterventions: string[]
): string | null {
  for (const code of appliedInterventions) {
    const targetedCells = INTERVENTION_CELL_MAPPING[code] || []
    if (targetedCells.includes(cellId)) {
      return code // Return which intervention targets this cell
    }
  }
  return null
}

/**
 * Check if a dimension is targeted by any applied intervention
 */
export function isDimensionTargeted(
  dimensionId: number,
  appliedInterventions: string[]
): string | null {
  for (const code of appliedInterventions) {
    const intervention = INTERVENTIONS[code]
    if (intervention.targets.capabilityDimensions?.includes(dimensionId)) {
      return code
    }
  }
  return null
}

/**
 * Get intervention display info for badge
 */
export function getInterventionInfo(code: string) {
  const intervention = INTERVENTIONS[code]
  if (!intervention) return null

  return {
    code,
    name: intervention.name,
    category: intervention.category,
    color: getCategoryColor(intervention.category)
  }
}

function getCategoryColor(category: string): string {
  switch (category) {
    case 'Leadership': return 'blue'
    case 'Communication': return 'purple'
    case 'Training': return 'green'
    case 'Process': return 'orange'
    case 'Culture': return 'pink'
    case 'Technology': return 'cyan'
    default: return 'gray'
  }
}
