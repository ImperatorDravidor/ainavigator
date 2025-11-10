# Intervention-Based Phase Progression System - Design Document

## Problem Statement

Current system has phases with random improvements that don't tell a story. We need:
- Logical progression where each phase improves based on SPECIFIC interventions
- Data-driven intervention selection based on actual problem areas
- Realistic improvement patterns (only affected areas improve)
- Clear attribution: "This cell improved because of intervention X"

## System Architecture

### Phase Progression Model

```
BASELINE (Oct 2024)
  ↓
  Analyze → Identify top 5-8 problem areas (highest resistance cells/lowest capability dimensions)
  ↓
  Select Interventions → Choose 3-4 targeted interventions (A1, B2, C1, etc.)
  ↓
  Apply → Document which interventions target which areas
  ↓
PHASE 2 (Mar 2025)
  ↓
  Show Results → Only targeted areas improve (with attribution)
  ↓
  Analyze Remaining Issues → New problem areas + persistent issues
  ↓
  Select New Interventions → 3-4 more interventions (A2, C3, D1, etc.)
  ↓
  Apply → Document new intervention mappings
  ↓
PHASE 3 (Nov 2025)
  ↓
  Show Results → Targeted improvements from Phase 2 interventions
  ↓
  Continue...
```

## Intervention Metadata Structure

### Intervention Taxonomy

```typescript
interface Intervention {
  code: string                    // "A1", "B2", "C1", etc.
  category: 'Leadership' | 'Communication' | 'Training' | 'Process' | 'Culture' | 'Technology'
  name: string                    // "Executive AI Vision Workshops"
  description: string             // Detailed explanation

  // What this intervention targets
  targets: {
    sentimentLevels?: number[]    // [1, 2] = targets Aware & Interested levels
    sentimentCategories?: number[] // [3, 4] = targets Fear/Control, Unclear Value
    capabilityDimensions?: number[] // [1, 2] = targets Strategy, Data dimensions
  }

  // Expected impact
  impact: {
    sentimentReduction: number    // -0.3 to -0.8 (reduces resistance)
    capabilityIncrease: number    // +0.5 to +1.2 (increases maturity)
    timeframe: 'immediate' | 'short-term' | 'medium-term'
    confidence: 'high' | 'medium' | 'low'
  }

  // Implementation details
  effort: 'low' | 'medium' | 'high'
  cost: 'low' | 'medium' | 'high'
  prerequisites?: string[]        // Requires other interventions first
}
```

### Example Interventions

```typescript
const INTERVENTIONS: Record<string, Intervention> = {
  'A1': {
    code: 'A1',
    category: 'Leadership',
    name: 'Executive AI Vision Workshops',
    description: 'C-suite alignment sessions to develop clear AI strategy and vision',
    targets: {
      sentimentLevels: [1, 2],      // Aware & Interested
      sentimentCategories: [4, 5],   // Unclear Value & Career Concerns
      capabilityDimensions: [1]      // Strategy & Vision
    },
    impact: {
      sentimentReduction: -0.4,      // Reduces resistance by 0.4
      capabilityIncrease: 0.8,       // Increases strategy capability by 0.8
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
    description: 'Regular town halls and updates on AI implementation plans',
    targets: {
      sentimentLevels: [2, 3],      // Interested & Willing
      sentimentCategories: [3, 4],   // Fear/Control & Unclear Value
    },
    impact: {
      sentimentReduction: -0.5,
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
    description: 'Hands-on training for AI tools and techniques',
    targets: {
      sentimentLevels: [3, 4],      // Willing & Engaged
      sentimentCategories: [1, 5],   // Workload & Career Concerns
      capabilityDimensions: [4]      // Talent & Skills
    },
    impact: {
      sentimentReduction: -0.6,
      capabilityIncrease: 1.0,
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
    description: 'Empower department leaders as AI advocates',
    targets: {
      sentimentLevels: [4, 5],      // Engaged & Advocating
      sentimentCategories: [2],      // Skill Gap
      capabilityDimensions: [5]      // Organization
    },
    impact: {
      sentimentReduction: -0.3,
      capabilityIncrease: 0.6,
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
    description: 'Deep technical training and certification',
    targets: {
      sentimentLevels: [5],          // Advocating
      sentimentCategories: [2],       // Skill Gap
      capabilityDimensions: [4, 6]    // Talent & Innovation
    },
    impact: {
      sentimentReduction: -0.4,
      capabilityIncrease: 1.2,
      timeframe: 'medium-term',
      confidence: 'high'
    },
    effort: 'high',
    cost: 'high',
    prerequisites: ['C1']  // Requires basic training first
  },

  'D1': {
    code: 'D1',
    category: 'Process',
    name: 'AI Governance Framework',
    description: 'Establish clear policies and decision-making processes',
    targets: {
      capabilityDimensions: [8]      // Ethics & Responsibility
    },
    impact: {
      sentimentReduction: -0.2,
      capabilityIncrease: 0.9,
      timeframe: 'medium-term',
      confidence: 'high'
    },
    effort: 'high',
    cost: 'medium'
  }
}
```

## Data Generation Logic

### Phase 2 Generation (from Baseline)

```typescript
function generatePhase2Data(
  baselineData: any[],
  appliedInterventions: string[] // e.g., ['A1', 'B2', 'C1']
) {
  return baselineData.map(respondent => {
    const updatedRespondent = { ...respondent }

    // For each applied intervention
    appliedInterventions.forEach(code => {
      const intervention = INTERVENTIONS[code]

      // Apply sentiment improvements to targeted cells
      if (intervention.targets.sentimentLevels && intervention.targets.sentimentCategories) {
        intervention.targets.sentimentLevels.forEach(level => {
          intervention.targets.sentimentCategories.forEach(category => {
            const cellId = `L${level}_C${category}`
            const columnName = SENTIMENT_COLUMN_MAPPING[cellId]

            if (columnName && updatedRespondent[columnName]) {
              // Apply reduction with some randomness
              const reduction = intervention.impact.sentimentReduction
              const variance = Math.random() * 0.1 - 0.05 // ±0.05
              updatedRespondent[columnName] = Math.max(
                1.0,
                updatedRespondent[columnName] + reduction + variance
              )
            }
          })
        })
      }

      // Apply capability improvements to targeted dimensions
      if (intervention.targets.capabilityDimensions) {
        intervention.targets.capabilityDimensions.forEach(dimId => {
          // Apply to all constructs in this dimension
          const constructs = getConstructsForDimension(dimId)
          constructs.forEach(constructColumn => {
            if (updatedRespondent[constructColumn]) {
              const increase = intervention.impact.capabilityIncrease
              const variance = Math.random() * 0.2 - 0.1 // ±0.1
              updatedRespondent[constructColumn] = Math.min(
                7.0,
                updatedRespondent[constructColumn] + increase + variance
              )
            }
          })
        })
      }
    })

    return {
      ...updatedRespondent,
      survey_wave: 'mar-2025-phase2',
      assessment_date: new Date('2025-03-01').toISOString()
    }
  })
}
```

### Realistic Improvement Pattern

**Key Principle**: Only areas targeted by interventions improve. Other areas stay same or slightly regress.

```typescript
// Baseline: Cell L2_C4 (Interested × Unclear Value) = 2.3
// Apply B2 (targets L2_C4): -0.5 reduction
// Phase 2: Cell L2_C4 = 1.8 ✅

// Baseline: Cell L5_C1 (Advocating × Workload) = 1.9
// NO intervention targets L5_C1
// Phase 2: Cell L5_C1 = 1.9 (unchanged) or 2.0 (slight increase)
```

## UI Components Needed

### 1. Intervention Selection Panel (per Phase)

```tsx
<InterventionSelector
  phase="baseline" // or "phase2", "phase3"
  currentProblems={[
    { type: 'sentiment', cellId: 'L2_C4', score: 2.3, priority: 1 },
    { type: 'capability', dimensionId: 1, score: 3.8, priority: 2 }
  ]}
  availableInterventions={INTERVENTIONS}
  selectedInterventions={['A1', 'B2', 'C1']}
  onSelect={(codes) => setPhaseInterventions(codes)}
/>
```

**Features**:
- Shows current top problems
- Recommends best-fit interventions
- Shows expected impact preview
- Validates prerequisites
- Shows cost/effort trade-offs

### 2. Intervention Impact Attribution

```tsx
// In heatmap cell
{showDelta && delta < 0 && (
  <div className="absolute bottom-1 left-1.5">
    <div className="bg-emerald-500/95">
      <TrendingDown className="w-2.5 h-2.5" />
      <span>{Math.abs(delta).toFixed(2)}</span>
      {/* NEW: Show which intervention caused this */}
      <Tooltip content="Improved by intervention B2: Transparent Communication">
        <span className="text-[8px] ml-1">B2</span>
      </Tooltip>
    </div>
  </div>
)}
```

### 3. Phase Timeline with Interventions

```tsx
<PhaseTimeline>
  <Phase name="Baseline" date="Oct 2024">
    <Problems>
      - High resistance in "Unclear Value" (avg 2.3)
      - Low Strategy & Vision capability (3.8)
    </Problems>
  </Phase>

  <Interventions applied={['A1', 'B2', 'C1']}>
    <Intervention code="A1" status="completed">
      Executive AI Vision Workshops → Strategy +0.8
    </Intervention>
    <Intervention code="B2" status="completed">
      Transparent Communication → Unclear Value -0.5
    </Intervention>
    <Intervention code="C1" status="completed">
      Skills Training → Talent +1.0
    </Intervention>
  </Interventions>

  <Phase name="Phase 2" date="Mar 2025">
    <Results>
      ✅ "Unclear Value" improved to 1.8 (-0.5, B2)
      ✅ Strategy capability improved to 4.6 (+0.8, A1)
      ⚠️ "Career Concerns" still high (2.1, not targeted)
    </Results>
  </Phase>

  <Interventions applied={['A2', 'C3', 'D1']}>
    <Intervention code="A2" status="planned">
      AI Champions Network → Career Concerns -0.3
    </Intervention>
    ...
  </Interventions>

  <Phase name="Phase 3" date="Nov 2025">
    <Results>
      ✅ "Career Concerns" improved to 1.8 (-0.3, A2)
      ...
    </Results>
  </Phase>
</PhaseTimeline>
```

## Database Schema Updates

### assessment_periods table

```sql
ALTER TABLE assessment_periods
ADD COLUMN interventions_metadata JSONB;

-- Example data
{
  "applied": [
    {
      "code": "A1",
      "applied_date": "2024-12-01",
      "status": "completed",
      "actual_impact": {
        "sentiment_cells": ["L1_C4", "L2_C4"],
        "capability_dimensions": [1],
        "avg_sentiment_reduction": -0.42,
        "avg_capability_increase": 0.85
      }
    },
    {
      "code": "B2",
      "applied_date": "2024-12-15",
      "status": "completed",
      "actual_impact": { ... }
    }
  ],
  "planned": [
    {
      "code": "A2",
      "planned_date": "2025-04-01",
      "status": "planned",
      "expected_impact": { ... }
    }
  ]
}
```

### New: interventions table

```sql
CREATE TABLE interventions (
  id UUID PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  targets JSONB NOT NULL,
  impact JSONB NOT NULL,
  effort VARCHAR(20),
  cost VARCHAR(20),
  prerequisites TEXT[]
);
```

## Implementation Plan

### Phase 1: Foundation
1. Create interventions metadata file
2. Build intervention impact calculator
3. Generate realistic Phase 2 data from baseline + [A1, B2, C1]
4. Update database with proper data

### Phase 2: UI Components
1. Intervention selection panel
2. Attribution badges on growth indicators
3. Phase timeline view
4. Intervention impact preview

### Phase 3: Phase 3 Workflow
1. Analysis of Phase 2 remaining problems
2. Recommend new interventions (A2, C3, D1)
3. Generate Phase 3 data from Phase 2 + new interventions
4. Show full progression story

## Example Story Arc

### Baseline (Oct 2024)
**Problem Areas**:
- Sentiment: "Unclear Value" (L2_C4, L3_C4) avg 2.4 → HIGH RESISTANCE
- Sentiment: "Career Concerns" (L2_C5, L3_C5) avg 2.2 → HIGH RESISTANCE
- Capability: Strategy & Vision (dim 1) avg 3.9 → LOW MATURITY
- Capability: Talent & Skills (dim 4) avg 4.1 → LOW MATURITY

**Decision**: Apply A1 (Strategy), B2 (Communication), C1 (Training)

### Phase 2 (Mar 2025)
**Results**:
- ✅ "Unclear Value" cells → 1.9 avg (-0.5) [B2 worked!]
- ✅ Strategy & Vision → 4.7 (+0.8) [A1 worked!]
- ✅ Talent & Skills → 5.1 (+1.0) [C1 worked!]
- ⚠️ "Career Concerns" → 2.2 (unchanged) [not targeted]
- ⚠️ "Fear/Control" → 2.0 (slight increase) [not targeted]

**New Problems Identified**:
- "Career Concerns" still high
- "Fear/Control" emerging issue
- Organization capability needs work

**Decision**: Apply A2 (Champions), C3 (Advanced Training), D1 (Governance)

### Phase 3 (Nov 2025)
**Results**:
- ✅ "Career Concerns" → 1.8 (-0.4) [A2 worked!]
- ✅ "Fear/Control" → 1.6 (-0.4) [D1 governance helped!]
- ✅ Organization → 5.2 (+0.6) [A2 worked!]
- ✅ Innovation → 5.8 (+0.8) [C3 worked!]

**Overall Progress**:
- Baseline: 66% readiness
- Phase 2: 76% readiness (+10%, targeted interventions)
- Phase 3: 84% readiness (+8%, sustained improvement)

This tells a REAL story of transformation!
