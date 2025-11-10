/**
 * Mini Interventions Service
 * Loads and manages the 78 mini interventions (26 categories × 3 actions each)
 * These are tactical, quick-win actions that complement the 10 strategic interventions
 */

export interface MiniIntervention {
  id: string
  category: string
  reason: string
  level: string
  description: string
  showsUpAs: string
  actionNumber: 1 | 2 | 3
  title: string
  explanation: string
  flavor: 'basic' | 'risky' | 'safe'
  // Mapping to heatmap
  levelId: number
  categoryId: number
  cellId: string
}

export interface MiniInterventionCategory {
  category: string
  reason: string
  level: string
  description: string
  showsUpAs: string
  levelId: number
  categoryId: number
  cellId: string
  actions: MiniIntervention[]
}

// Map category to heatmap coordinates
function mapCategoryToCell(reason: string, level: string): { levelId: number; categoryId: number; cellId: string } {
  // Reason categories (columns)
  const reasonMap: Record<string, number> = {
    'AI is too Autonomous': 1,
    'AI is too Inflexible': 2,
    'AI is Emotionless': 3,
    'AI is too Opaque': 4,
    'People Prefer Human Interaction': 5,
  }

  // Levels (rows)
  const levelMap: Record<string, number> = {
    'Personal Workflow Preferences': 1,
    'Collaboration & Role Adjustments': 2,
    'Professional Trust & Fairness Issues': 3,
    'Career Security & Job Redefinition Anxiety': 4,
    'Organizational Stability at Risk': 5,
  }

  const categoryId = reasonMap[reason] || 0
  const levelId = levelMap[level] || 0
  const cellId = `L${levelId}_C${categoryId}`

  return { levelId, categoryId, cellId }
}

// Determine flavor based on action number
function getActionFlavor(actionNumber: 1 | 2 | 3): 'basic' | 'risky' | 'safe' {
  switch (actionNumber) {
    case 1: return 'basic'   // Procedural, structured approach
    case 2: return 'risky'   // Creative, humorous approach
    case 3: return 'safe'    // Reflective, cautious approach
  }
}

class MiniInterventionsService {
  private categories: Map<string, MiniInterventionCategory> = new Map()
  private interventions: Map<string, MiniIntervention> = new Map()
  private loaded = false

  async loadData(): Promise<void> {
    if (this.loaded) return

    try {
      const response = await fetch('/data/categoriesandactionainav.csv')
      if (!response.ok) throw new Error('Failed to load mini interventions CSV')
      
      const text = await response.text()
      const lines = text.split('\n')
      
      // Skip header row
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        // Parse CSV line (accounting for quoted fields with commas)
        const fields = this.parseCSVLine(line)
        if (fields.length < 11) continue

        const [category, reason, level, description, showsUpAs, action1, explanation1, action2, explanation2, action3, explanation3] = fields
        
        const { levelId, categoryId, cellId } = mapCategoryToCell(reason, level)

        // Create category if doesn't exist
        if (!this.categories.has(cellId)) {
          this.categories.set(cellId, {
            category,
            reason,
            level,
            description,
            showsUpAs,
            levelId,
            categoryId,
            cellId,
            actions: []
          })
        }

        const categoryData = this.categories.get(cellId)!

        // Create 3 mini interventions for this category
        const actions: [string, string][] = [
          [action1, explanation1],
          [action2, explanation2],
          [action3, explanation3]
        ]

        actions.forEach(([title, explanation], index) => {
          const actionNumber = (index + 1) as 1 | 2 | 3
          const id = `${cellId}_A${actionNumber}`
          
          const intervention: MiniIntervention = {
            id,
            category,
            reason,
            level,
            description,
            showsUpAs,
            actionNumber,
            title: title.trim(),
            explanation: explanation.trim(),
            flavor: getActionFlavor(actionNumber),
            levelId,
            categoryId,
            cellId
          }

          categoryData.actions.push(intervention)
          this.interventions.set(id, intervention)
        })
      }

      this.loaded = true
      console.log(`✅ Loaded ${this.interventions.size} mini interventions across ${this.categories.size} categories`)
    } catch (error) {
      console.error('Error loading mini interventions:', error)
      throw error
    }
  }

  private parseCSVLine(line: string): string[] {
    const fields: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      const nextChar = line[i + 1]

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"'
          i++
        } else {
          // Toggle quote mode
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator
        fields.push(current)
        current = ''
      } else {
        current += char
      }
    }

    // Add last field
    if (current) {
      fields.push(current)
    }

    return fields
  }

  /**
   * Get all 3 mini interventions for a specific heatmap cell
   */
  getInterventionsForCell(levelId: number, categoryId: number): MiniIntervention[] {
    const cellId = `L${levelId}_C${categoryId}`
    const category = this.categories.get(cellId)
    return category?.actions || []
  }

  /**
   * Get category information for a cell
   */
  getCategoryForCell(levelId: number, categoryId: number): MiniInterventionCategory | null {
    const cellId = `L${levelId}_C${categoryId}`
    return this.categories.get(cellId) || null
  }

  /**
   * Get a specific mini intervention by ID
   */
  getById(id: string): MiniIntervention | null {
    return this.interventions.get(id) || null
  }

  /**
   * Get all mini interventions
   */
  getAllInterventions(): MiniIntervention[] {
    return Array.from(this.interventions.values())
  }

  /**
   * Get all categories
   */
  getAllCategories(): MiniInterventionCategory[] {
    return Array.from(this.categories.values())
  }

  /**
   * Search mini interventions by keyword
   */
  search(query: string): MiniIntervention[] {
    const lowercaseQuery = query.toLowerCase()
    return this.getAllInterventions().filter(intervention => 
      intervention.title.toLowerCase().includes(lowercaseQuery) ||
      intervention.explanation.toLowerCase().includes(lowercaseQuery) ||
      intervention.category.toLowerCase().includes(lowercaseQuery) ||
      intervention.reason.toLowerCase().includes(lowercaseQuery)
    )
  }

  /**
   * Filter by reason (AI characteristic)
   */
  filterByReason(reason: string): MiniIntervention[] {
    return this.getAllInterventions().filter(i => i.reason === reason)
  }

  /**
   * Filter by level (concern area)
   */
  filterByLevel(level: string): MiniIntervention[] {
    return this.getAllInterventions().filter(i => i.level === level)
  }

  /**
   * Filter by flavor
   */
  filterByFlavor(flavor: 'basic' | 'risky' | 'safe'): MiniIntervention[] {
    return this.getAllInterventions().filter(i => i.flavor === flavor)
  }

  /**
   * Group interventions by reason
   */
  groupByReason(): Map<string, MiniIntervention[]> {
    const groups = new Map<string, MiniIntervention[]>()
    
    this.getAllInterventions().forEach(intervention => {
      const reason = intervention.reason
      if (!groups.has(reason)) {
        groups.set(reason, [])
      }
      groups.get(reason)!.push(intervention)
    })

    return groups
  }

  /**
   * Group interventions by level
   */
  groupByLevel(): Map<string, MiniIntervention[]> {
    const groups = new Map<string, MiniIntervention[]>()
    
    this.getAllInterventions().forEach(intervention => {
      const level = intervention.level
      if (!groups.has(level)) {
        groups.set(level, [])
      }
      groups.get(level)!.push(intervention)
    })

    return groups
  }
}

// Export singleton instance
export const miniInterventionsService = new MiniInterventionsService()

