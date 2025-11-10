/**
 * Intervention commitment store
 * Tracks which interventions are committed for each phase
 */

export interface CommittedIntervention {
  code: string
  phase: 'baseline' | 'phase2' | 'phase3'
  committedDate: string
  targetAreas: string[]
  expectedImpact: string
}

// Local storage key
const STORAGE_KEY = 'committed_interventions'

/**
 * Get all committed interventions
 */
export function getCommittedInterventions(): CommittedIntervention[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/**
 * Get committed interventions for a specific phase
 */
export function getCommittedForPhase(phase: string): CommittedIntervention[] {
  return getCommittedInterventions().filter(i => i.phase === phase)
}

/**
 * Commit an intervention for a phase
 */
export function commitIntervention(intervention: CommittedIntervention): void {
  const current = getCommittedInterventions()
  
  // Check if already committed
  const exists = current.some(
    i => i.code === intervention.code && i.phase === intervention.phase
  )
  
  if (!exists) {
    current.push(intervention)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
  }
}

/**
 * Remove a committed intervention
 */
export function uncommitIntervention(code: string, phase: string): void {
  const current = getCommittedInterventions()
  const updated = current.filter(i => !(i.code === code && i.phase === phase))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

/**
 * Check if intervention is committed for a phase
 */
export function isCommitted(code: string, phase: string): boolean {
  return getCommittedInterventions().some(
    i => i.code === code && i.phase === phase
  )
}

/**
 * Get intervention codes for a phase
 */
export function getCommittedCodes(phase: string): string[] {
  return getCommittedForPhase(phase).map(i => i.code)
}

