/**
 * Analyzes each phase to identify specific weaknesses
 * Maps weaknesses to recommended interventions
 */

export interface PhaseWeakness {
  area: string
  type: 'sentiment' | 'capability'
  score: number
  benchmark?: number
  gap?: number
  severity: 'critical' | 'high' | 'medium' | 'low'
  affectedCount: number
  details: string
}

export interface InterventionRecommendation {
  code: string
  name: string
  targetWeaknesses: string[]
  expectedImpact: {
    area: string
    improvement: string
  }[]
  priority: number
}

/**
 * Analyze sentiment heatmap to find problem areas
 */
export function analyzeSentimentWeaknesses(data: any[]): PhaseWeakness[] {
  if (!data || data.length === 0) return []
  
  const weaknesses: PhaseWeakness[] = []
  const LEVELS = [
    'Personal Workflow',
    'Collaboration',
    'Professional Trust',
    'Career Security',
    'Organizational Stability'
  ]
  const CATEGORIES = [
    'Too Autonomous',
    'Too Inflexible',
    'Emotionless',
    'Too Opaque',
    'Prefer Human'
  ]
  
  // Check each cell (Q1-Q25)
  for (let level = 0; level < 5; level++) {
    for (let cat = 0; cat < 5; cat++) {
      const questionNum = level * 5 + cat + 1
      const key = `sentiment_${questionNum}`
      
      const scores = data
        .map(row => row[key])
        .filter((s): s is number => typeof s === 'number' && !isNaN(s))
      
      if (scores.length > 0) {
        const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length
        
        // High resistance (3.5+ on 1-4 scale) is a problem
        if (avg >= 3.5) {
          weaknesses.push({
            area: `${LEVELS[level]} - ${CATEGORIES[cat]}`,
            type: 'sentiment',
            score: avg,
            severity: avg >= 3.8 ? 'critical' : 'high',
            affectedCount: scores.length,
            details: `Q${questionNum}: High resistance at ${LEVELS[level]} when AI is ${CATEGORIES[cat]}`
          })
        }
      }
    }
  }
  
  return weaknesses.sort((a, b) => b.score - a.score).slice(0, 10)
}

/**
 * Analyze capability dimensions to find gaps
 */
export function analyzeCapabilityWeaknesses(
  data: any[],
  benchmarks: Record<number, number>
): PhaseWeakness[] {
  if (!data || data.length === 0) return []
  
  const weaknesses: PhaseWeakness[] = []
  const DIMENSIONS: Record<number, string> = {
    1: 'Strategy & Vision',
    2: 'Data Maturity',
    3: 'Technology Infrastructure',
    4: 'Talent & Skills',
    5: 'Organization & Processes',
    6: 'Innovation Capability',
    7: 'Adaptation & Adoption',
    8: 'Ethics & Responsibility'
  }
  
  // Calculate average per dimension
  for (let dim = 1; dim <= 8; dim++) {
    const dimScores = data
      .filter(row => row.dimension_id === dim)
      .map(row => row.score)
      .filter((s): s is number => typeof s === 'number' && !isNaN(s))
    
    if (dimScores.length > 0) {
      const avg = dimScores.reduce((sum, s) => sum + s, 0) / dimScores.length
      const benchmark = benchmarks[dim] || 5.0
      const gap = benchmark - avg
      
      // Gap > 0.5 is a problem
      if (gap > 0.5) {
        weaknesses.push({
          area: DIMENSIONS[dim],
          type: 'capability',
          score: avg,
          benchmark,
          gap,
          severity: gap > 1.5 ? 'critical' : gap > 1.0 ? 'high' : 'medium',
          affectedCount: dimScores.length,
          details: `Dimension ${dim}: ${gap.toFixed(1)} point gap below industry benchmark`
        })
      }
    }
  }
  
  return weaknesses.sort((a, b) => (b.gap || 0) - (a.gap || 0))
}

/**
 * Map weaknesses to recommended interventions
 */
export function getRecommendedInterventions(
  weaknesses: PhaseWeakness[]
): InterventionRecommendation[] {
  const recommendations: InterventionRecommendation[] = []
  
  // Check for sentiment issues
  const sentimentWeaknesses = weaknesses.filter(w => w.type === 'sentiment')
  const capabilityWeaknesses = weaknesses.filter(w => w.type === 'capability')
  
  // A1: Strategy & Governance - if org stability or strategy gap
  if (
    sentimentWeaknesses.some(w => w.area.includes('Organizational Stability')) ||
    capabilityWeaknesses.some(w => w.area === 'Strategy & Vision')
  ) {
    recommendations.push({
      code: 'A1',
      name: 'AI Strategy & Governance Framework',
      targetWeaknesses: ['Organizational Stability', 'Strategy & Vision'],
      expectedImpact: [
        { area: 'Q21-25 (Org Stability)', improvement: '-25% resistance' },
        { area: 'Dimension 1 (Strategy)', improvement: '+0.6 points' }
      ],
      priority: 1
    })
  }
  
  // B2: Training - if collaboration or talent gap
  if (
    sentimentWeaknesses.some(w => w.area.includes('Collaboration')) ||
    capabilityWeaknesses.some(w => w.area === 'Talent & Skills')
  ) {
    recommendations.push({
      code: 'B2',
      name: 'AI Literacy & Training Program',
      targetWeaknesses: ['Collaboration', 'Talent & Skills'],
      expectedImpact: [
        { area: 'Q6-10 (Collaboration)', improvement: '-20% resistance' },
        { area: 'Dimension 4 (Talent)', improvement: '+0.5 points' }
      ],
      priority: 1
    })
  }
  
  // C1: Innovation Labs - if career or innovation gap
  if (
    sentimentWeaknesses.some(w => w.area.includes('Career')) ||
    capabilityWeaknesses.some(w => w.area === 'Innovation Capability')
  ) {
    recommendations.push({
      code: 'C1',
      name: 'Innovation Labs & Experimentation',
      targetWeaknesses: ['Career Security', 'Innovation Capability'],
      expectedImpact: [
        { area: 'Q16-20 (Career)', improvement: '-20% resistance' },
        { area: 'Dimension 6 (Innovation)', improvement: '+0.4 points' }
      ],
      priority: 2
    })
  }
  
  // A3: Ethics - if trust or ethics gap
  if (
    sentimentWeaknesses.some(w => w.area.includes('Trust') || w.area.includes('Opaque')) ||
    capabilityWeaknesses.some(w => w.area === 'Ethics & Responsibility')
  ) {
    recommendations.push({
      code: 'A3',
      name: 'AI Ethics & Responsible AI Program',
      targetWeaknesses: ['Professional Trust', 'Ethics & Responsibility'],
      expectedImpact: [
        { area: 'Q11-15 (Trust)', improvement: '-25% resistance' },
        { area: 'Dimension 8 (Ethics)', improvement: '+0.7 points' }
      ],
      priority: 2
    })
  }
  
  return recommendations.sort((a, b) => a.priority - b.priority)
}

