// Core data types for AI Navigator

export interface SentimentResponse {
  id: string
  responseId: string
  sentimentLevel?: 1 | 2 | 3 | 4 | 5 // 1=Resistant, 5=Ready (deprecated)
  sentimentReason?: string // One of 5 reason categories (deprecated)
  region: string
  department: string
  role: string
  ageGroup?: string
  businessUnit?: string
  timestamp: Date
  // 25 sentiment scores from CSV (sentiment_1 through sentiment_25)
  sentiment_1?: number
  sentiment_2?: number
  sentiment_3?: number
  sentiment_4?: number
  sentiment_5?: number
  sentiment_6?: number
  sentiment_7?: number
  sentiment_8?: number
  sentiment_9?: number
  sentiment_10?: number
  sentiment_11?: number
  sentiment_12?: number
  sentiment_13?: number
  sentiment_14?: number
  sentiment_15?: number
  sentiment_16?: number
  sentiment_17?: number
  sentiment_18?: number
  sentiment_19?: number
  sentiment_20?: number
  sentiment_21?: number
  sentiment_22?: number
  sentiment_23?: number
  sentiment_24?: number
  sentiment_25?: number
}

export interface CapabilityResponse {
  id: string
  responseId: string
  
  // 8 Dimensions × 4 Constructs = 32 scores
  strategyVision_C1: number // 1-5 scale
  strategyVision_C2: number
  strategyVision_C3: number
  strategyVision_C4: number
  
  data_C1: number
  data_C2: number
  data_C3: number
  data_C4: number
  
  technology_C1: number
  technology_C2: number
  technology_C3: number
  technology_C4: number
  
  talentSkills_C1: number
  talentSkills_C2: number
  talentSkills_C3: number
  talentSkills_C4: number
  
  orgProcesses_C1: number
  orgProcesses_C2: number
  orgProcesses_C3: number
  orgProcesses_C4: number
  
  innovation_C1: number
  innovation_C2: number
  innovation_C3: number
  innovation_C4: number
  
  adaptation_C1: number
  adaptation_C2: number
  adaptation_C3: number
  adaptation_C4: number
  
  ethics_C1: number
  ethics_C2: number
  ethics_C3: number
  ethics_C4: number
  
  // Open-ended feedback
  openFeedback: string
  
  // Metadata
  region: string
  function: string
  ageGroup?: string
  businessUnit?: string
  timestamp: Date
}

// Aggregated data structures
export interface SentimentArea {
  areaId: string // e.g., "L1_R3"
  level: number
  reason: string
  label: string // Display name
  description: string // Explanation
  averageScore: number // Computed average
  respondentCount: number // Sample size
  benchmarkScore?: number // Industry/region benchmark
  interventions: string[] // Recommended actions
  color?: string // Display color
}

export interface CapabilityDimension {
  dimensionId: string
  name: string
  averageScore: number
  minScore: number
  maxScore: number
  benchmarkScore?: number
  constructs: CapabilityConstruct[]
}

export interface CapabilityConstruct {
  constructId: string
  name: string
  averageScore: number
  benchmarkScore?: number
  gapAnalysis: {
    vsAverage: number
    vsBenchmark?: number
  }
}

// Intervention types
export interface SpotlightIntervention {
  id: string
  title: string
  description: string
  fullDescription: string
  impactArea: 'sentiment' | 'capability' | 'both'
  targetDimensions?: string[]
  targetConstructs?: string[]
  targetSentimentAreas?: string[]
  roiEstimate: {
    min: number
    max: number
    unit: string // 'percent', 'efficiency', etc.
    description: string
  }
  priority: 'high' | 'medium' | 'low'
  implementation: {
    duration: string
    difficulty: 'easy' | 'medium' | 'hard'
    resources: string[]
  }
}

// Filter types
export interface FilterState {
  region?: string
  department?: string
  function?: string
  ageGroup?: string
  businessUnit?: string
  role?: string
}

// Session data
export interface SessionData {
  id: string
  uploadedAt: Date
  sentimentData: SentimentResponse[]
  capabilityData: CapabilityResponse[]
  filters: FilterState
  selectedFlow?: 'sentiment' | 'capability'
}

// Chart data types
export interface HeatmapCell {
  x: number // column (reason)
  y: number // row (level)
  value: number // average score
  count: number // number of responses
  label: string
  description: string
  color: string
}

export interface RadarDataPoint {
  dimension: string
  current: number
  benchmark?: number
  min?: number
  max?: number
}

export interface RadarChartData {
  data: RadarDataPoint[]
  selectedDimension?: string
}

// Export types
export interface ExportData {
  timestamp: Date
  organization?: string
  flow: 'sentiment' | 'capability'
  filters: FilterState
  sentimentSummary?: {
    heatmapData: HeatmapCell[]
    topIssues: string[]
    averageReadiness: number
  }
  capabilitySummary?: {
    dimensions: CapabilityDimension[]
    weakestAreas: string[]
    strongestAreas: string[]
  }
  recommendations: SpotlightIntervention[]
  roiSummary?: {
    totalPotentialImpact: string
    timeToValue: string
  }
}

// Benchmark data
export interface BenchmarkData {
  industry: string
  region: string
  sentimentBenchmarks: {
    [areaId: string]: number
  }
  capabilityBenchmarks: {
    [dimensionId: string]: {
      average: number
      constructs: {
        [constructId: string]: number
      }
    }
  }
  updatedAt: Date
}

// Demo data types
export interface DemoDataset {
  name: string
  description: string
  sentimentResponses: number
  capabilityResponses: number
  industries: string[]
  regions: string[]
  highlights: string[]
}
