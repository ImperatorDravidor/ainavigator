/**
 * Hardcoded Phase 2 data for demo
 * Shows improvement after implementing A1, B2, C1 interventions
 */

export const PHASE2_METRICS = {
  // Baseline was low (2.4/4.0), Phase 2 shows improvement
  sentimentAvg: 2.9, // Improved from 2.4
  
  // Baseline was moderate (4.3/7.0), Phase 2 shows progress  
  capabilityAvg: 4.8, // Improved from 4.3
  
  // Composite: (2.9/4.0 * 0.4) + (4.8/7.0 * 0.6) = 0.29 + 0.41 = 0.70 = 70%
  compositeScore: 70,
  
  vsBaseline: {
    sentiment: '+21%', // From 2.4 to 2.9
    capability: '+12%', // From 4.3 to 4.8
    composite: '+8%' // From 62% to 70%
  }
}

// Hardcoded improved sentiment scores for Phase 2
export const PHASE2_SENTIMENT_MULTIPLIER = 1.21 // 21% improvement

// Hardcoded improved capability scores for Phase 2
export const PHASE2_CAPABILITY_MULTIPLIER = 1.12 // 12% improvement

