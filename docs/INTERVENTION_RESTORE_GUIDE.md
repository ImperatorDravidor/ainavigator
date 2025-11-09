# Intervention Data Restoration Guide

## Problem Summary

The original **75 interventions** (25 heatmap cells × 3 interventions per cell) were not being loaded into the database due to:

1. **Missing RLS Policies**: The intervention tables had SELECT policies but no INSERT/UPDATE policies
2. **Incorrect File Paths**: The import script was looking in `Interventions/` but files were actually in `docs/archive/intervention-source-docs/`

## What We Have

### Source Data Location
- **Excel File**: `docs/archive/intervention-source-docs/0 - Overview of interventions per area.xlsx`
  - Contains 4 sheets:
    - `List of interventions` - 10 master interventions (A1-A3, B1-B5, C1-C2)
    - `Interventions Sentiment Cat` - **25 heatmap cell mappings** (the 75 assignments)
    - `Interventions capability dim` - 8 capability dimension mappings
    - `Follow up interventions` - 10 next-step progression mappings

- **Word Documents**: `docs/archive/intervention-source-docs/*.docx`
  - 10 files with detailed intervention descriptions (A1-A3, B1-B5, C1-C2)

### The 25 Heatmap Cell Mappings (75 Interventions)

Each of the 25 cells (5 levels × 5 categories) has 3 unique intervention recommendations:

#### Level 1: Personal Workflow Preferences (Cells 1-5)
1. **The Intrusive AI** (Autonomous) → B1, B2, C1
2. **The Unadaptive AI** (Inflexible) → B2, B5, A2
3. **The Uncaring AI** (Emotionless) → B1, B4, C2
4. **The Confusing AI** (Opaque) → B3, B5, A3
5. **The Aloof AI** (Prefer Human) → B4, B1, A1

#### Level 2: Collaboration & Role Adjustments (Cells 6-10)
6. **The Redefining AI** (Autonomous) → B1, B2, A2
7. **The Forcing AI** (Inflexible) → B4, B1, C1
8. **The Distant AI** (Emotionless) → B2, B3, A3
9. **The Obscuring AI** (Opaque) → B5, B1, A1
10. **The Separating AI** (Prefer Human) → B1, B4, C2

#### Level 3: Trust & Fairness Issues (Cells 11-15)
11. **The Unjust AI** (Autonomous) → A2, B1, C2
12. **The Constricting AI** (Inflexible) → A3, B2, A1
13. **The Callous AI** (Emotionless) → A2, B4, B1
14. **The Hidden AI** (Opaque) → A3, B2, C1
15. **The Usurping AI** (Prefer Human) → A1, B1, C2

#### Level 4: Career Security & Job Redefinition (Cells 16-20)
16. **The Threatening AI** (Autonomous) → C1, B1, A2
17. **The Stagnating AI** (Inflexible) → B2, B3, A3
18. **The Devaluing AI** (Emotionless) → C1, B4, B1
19. **The Unknowable AI** (Opaque) → C2, B5, A1
20. **The Replacing AI** (Prefer Human) → B4, B2, B1

#### Level 5: Organisational Stability at Risk (Cells 21-25)
21. **The Uncontrolled AI** (Autonomous) → A1, B1, C2
22. **The Brittle AI** (Inflexible) → A3, B4, C1
23. **The Dehumanizing AI** (Emotionless) → A2, B1, B3
24. **The Risky AI** (Opaque) → A3, B2, C1
25. **The Undermining AI** (Prefer Human) → A1, B1, C2

## Fixes Applied

### 1. Updated Import Script Paths
**File**: `scripts/import_interventions.py`

Changed:
```python
EXCEL_FILE = 'Interventions/0 - Overview of interventions per area.xlsx'
INTERVENTIONS_DIR = 'Interventions'
```

To:
```python
EXCEL_FILE = 'docs/archive/intervention-source-docs/0 - Overview of interventions per area.xlsx'
INTERVENTIONS_DIR = 'docs/archive/intervention-source-docs'
```

### 2. Added Missing RLS Policies
**File**: `supabase/migrations/009_interventions_insert_policies.sql`

Added INSERT and UPDATE policies for:
- `interventions`
- `intervention_sentiment_mappings` ← **Critical for the 75 mappings**
- `intervention_capability_mappings`
- `intervention_next_steps`

## How to Restore the Data

### Step 1: Apply Migration (if not already applied)
```bash
# Option A: Via Supabase Dashboard
# Go to SQL Editor and run the contents of:
# supabase/migrations/009_interventions_insert_policies.sql

# Option B: Via Supabase CLI (if configured)
supabase db push
```

### Step 2: Run Import Script
```bash
cd /Users/Dev/Desktop/ainavigator

# Ensure dependencies are installed
pip install pandas openpyxl python-docx supabase

# Run the import
python3 scripts/import_interventions.py
```

### Expected Output
```
================================================================================
🚀 INTERVENTION DATA IMPORT
================================================================================
Source: docs/archive/intervention-source-docs/0 - Overview of interventions per area.xlsx
Descriptions: docs/archive/intervention-source-docs/*.docx
Database: [your-supabase-url]

================================================================================
📋 Step 1: Importing Interventions
================================================================================
  ✓ A1: AI Roadmap Pressure Cooker...
  ✓ A2: AI Dialectics Sessions...
  [... 8 more ...]

✅ Inserted 10 interventions

================================================================================
📊 Step 2: Importing Sentiment Heatmap Mappings (25 cells)
================================================================================
  ✓ L1×C1: B1, B2, C1
  ✓ L1×C2: B2, B5, A2
  [... 23 more ...]

✅ Inserted 25 sentiment mappings  ← THE 75 INTERVENTIONS ARE HERE

================================================================================
🔷 Step 3: Importing Capability Dimension Mappings (8 dimensions)
================================================================================
  [... 8 mappings ...]

✅ Inserted 8 capability mappings

================================================================================
➡️  Step 4: Importing Next Steps / Progression Logic (10 interventions)
================================================================================
  [... 10 progression chains ...]

✅ Inserted 10 next step mappings

================================================================================
🔍 Step 5: Verification
================================================================================
  📋 Interventions: 10 (expected: 10)
  📊 Sentiment mappings: 25 (expected: 25)
  🔷 Capability mappings: 8 (expected: 8)
  ➡️  Next steps: 10 (expected: 10)

✅ ALL VERIFICATION CHECKS PASSED!

================================================================================
🎉 INTERVENTION DATA IMPORT COMPLETE!
================================================================================
```

## Verification

After import, verify in Supabase:

```sql
-- Should return 25 rows (the 75 mappings are stored as 25 rows with 3 codes each)
SELECT 
  level_id, 
  category_id, 
  primary_intervention_code, 
  secondary_intervention_code, 
  tertiary_intervention_code
FROM intervention_sentiment_mappings
ORDER BY level_id, category_id;

-- Test a specific cell (Level 1, Category 1 = Personal × Autonomous)
SELECT * FROM intervention_sentiment_mappings 
WHERE level_id = 1 AND category_id = 1;
-- Should return: B1, B2, C1
```

## Frontend Usage

The interventions are now accessible via API:

```typescript
// Get interventions for a specific heatmap cell
const response = await fetch('/api/interventions/sentiment?level=1&category=1')
const { interventions } = await response.json()
// Returns 3 interventions: [B1, B2, C1]
```

## Files Modified

1. ✅ `scripts/import_interventions.py` - Updated file paths
2. ✅ `supabase/migrations/009_interventions_insert_policies.sql` - New migration
3. ✅ `docs/INTERVENTION_RESTORE_GUIDE.md` - This file

## Historical Note

- **Original Design**: 25 heatmap cells × 3 interventions = 75 unique assignments
- **What Happened**: Import script couldn't write to DB due to missing INSERT policies
- **Current State**: All 75 mappings preserved in Excel, ready to import
- **Business Team Contribution**: The 10 base interventions came from business team; the 75 mappings (3 per cell) were your original design

## Next Steps

1. ✅ Apply migration 009
2. ✅ Run import script
3. ✅ Verify data in Supabase
4. ✅ Test API endpoints
5. ✅ Confirm heatmap cells now show unique interventions per cell

