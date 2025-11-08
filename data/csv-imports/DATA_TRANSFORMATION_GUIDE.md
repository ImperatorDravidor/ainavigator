# Data Transformation Guide – Capability Data Integration

## 📋 Overview

This document explains the data transformation process for integrating capability assessment data into the AI Navigator platform. The transformation converts capability data from **long format** (one row per construct) to **wide format** (one row per respondent with 32 construct columns).

## 🎯 Business Context

**Goal**: Enable the Web Summit MVP to display both sentiment and capability assessments for organizations, with benchmark comparisons across regions, departments, and industries.

**Challenge**: The data scientist provided capability data in normalized (long) format, but our frontend/visualization layer requires denormalized (wide) format for efficient querying.

---

## 📊 Data Structure Overview

### **Source Format: Long (Normalized)**
```csv
ResponseId_id,dimension_id,dimension,construct_id,construct,score,industry_synthetic,country_synthetic,continent_synthetic,role_synthetic
0046a5e5,1,Strategy and Vision,1,Alignment with Business Goals,4.0,Government,India,North America,Staff
0046a5e5,1,Strategy and Vision,2,Leadership Commitment,3.5,Government,India,North America,Staff
0046a5e5,1,Strategy and Vision,3,Long-Term Vision,5.0,Government,India,North America,Staff
...
```

**Characteristics**:
- ✅ Normalized (3NF compliance)
- ✅ Easy to add new constructs
- ✅ Flexible for analytics
- ❌ 260,065 rows (requires joins for visualization)
- ❌ Complex queries for heatmap/radar rendering

### **Target Format: Wide (Denormalized)**
```csv
respondent_id,industry,country,continent,role,construct_1,construct_2,...,construct_32
0046a5e5,Government,India,North America,Staff,4.0,3.5,5.0,...,4.2
```

**Characteristics**:
- ✅ Fast queries (no joins needed)
- ✅ Direct mapping to UI components
- ✅ Single row per respondent (~8,127 rows)
- ✅ Compatible with existing sentiment data structure
- ❌ Less flexible for schema changes

---

## 🔄 Transformation Logic

### **Step 1: Extract & Deduplicate**

**Issue Found**: Some respondents have multiple entries for the same construct with different scores.

**Example**:
```
318a6f0c, construct_1: 3.0
318a6f0c, construct_1: 5.56
```

**Resolution Strategy**: Average duplicate construct scores per respondent.

**Rationale**: Similar to sentiment data handling (multiple sessions → averaged scores), this preserves data integrity while creating a single source of truth.

```python
# Pseudo-code
grouped = capability_df.groupby(['ResponseId_id', 'construct_id'])
averaged = grouped['score'].mean()
```

### **Step 2: Pivot to Wide Format**

Transform from one-row-per-construct to one-row-per-respondent:

```python
pivoted = averaged.pivot_table(
    index='ResponseId_id',
    columns='construct_id',
    values='score'
)
# Rename columns: construct_1, construct_2, ..., construct_32
pivoted.columns = [f'construct_{i}' for i in range(1, 33)]
```

**Result**: Each respondent has exactly one row with 32 construct scores.

### **Step 3: Merge Metadata Fields**

Capability data includes synthetic metadata fields not present in sentiment data:

| Capability Field | Database Field | Mapping Strategy |
|------------------|----------------|------------------|
| `industry_synthetic` | `industry` | New column (added to schema) |
| `country_synthetic` | `region` | Map to existing region field |
| `continent_synthetic` | `continent` | New column (added to schema) |
| `role_synthetic` | `employment_type` | Map to existing field |

**Important**: These fields are kept **distinct** from sentiment metadata because:
- Sentiment data: Real survey metadata (Region, Department, Age, Employment_type)
- Capability data: Synthetic filters for demo purposes (industry, country, role)

### **Step 4: Match Respondents**

**Matching Strategy**:
1. Check if `ResponseId_id` exists in sentiment `respondents` table
2. If YES → Update existing row with capability scores
3. If NO → Insert new row with capability scores only (sentiment scores = NULL)

**Rationale**: Not all respondents took both assessments. This allows flexibility.

### **Step 5: Company Assignment**

Since capability CSV lacks `company_id`:

**Strategy**: Distribute respondents across 3 demo companies using hash-based assignment for realistic distribution:

```python
company_ids = ['acme-corp', 'tech-innovations', 'global-solutions']
respondent['company_id'] = hash(respondent_id) % 3  # Deterministic distribution
```

**Distribution Target**: ~33% per company (~2,700 respondents each)

---

## 📐 Scale Normalization

### **Score Range Update**

**Original Assumption**: Capability scores use 1-5 Likert scale
**Actual Data**: Scores range from 1.0 to 7.0 (observed max: 7.0)

**Decision**: **Keep 1-7 scale** for capability constructs.

**Rationale**:
- Preserves data fidelity (no information loss)
- Aligns with data scientist's intent
- Allows finer granularity in capability assessment
- Database schema supports DECIMAL(5,2) - no changes needed

**Documentation Update**:
```
Sentiment Scores: 1.0 - 2.0 (raw) → 2.0 - 4.0 (transformed display)
Capability Scores: 1.0 - 7.0 (raw & display)
```

---

## 🗄️ Database Schema Updates

### **New Columns Added to `respondents` Table**

```sql
ALTER TABLE respondents
  ADD COLUMN IF NOT EXISTS industry TEXT,
  ADD COLUMN IF NOT EXISTS continent TEXT;

-- Index for benchmark filtering
CREATE INDEX IF NOT EXISTS idx_respondents_industry ON respondents(industry);
CREATE INDEX IF NOT EXISTS idx_respondents_continent ON respondents(continent);
```

### **Field Mapping Summary**

| CSV Column | DB Column | Type | Notes |
|------------|-----------|------|-------|
| `ResponseId_id` | `respondent_id` | TEXT | Primary identifier |
| `industry_synthetic` | `industry` | TEXT | New field for benchmarks |
| `country_synthetic` | `region` | TEXT | Maps to existing region |
| `continent_synthetic` | `continent` | TEXT | New field for global benchmarks |
| `role_synthetic` | `employment_type` | TEXT | Maps to existing field |
| `score` (construct_1) | `construct_1` | DECIMAL(5,2) | Pivoted from long format |
| ... | ... | ... | ... |
| `score` (construct_32) | `construct_32` | DECIMAL(5,2) | Pivoted from long format |

---

## 🔍 Data Quality Checks

### **Pre-Transformation Validation**

1. **Row Count**: 260,065 rows ÷ 32 constructs = ~8,127 unique respondents ✅
2. **Construct Coverage**: All constructs 1-32 present ✅
3. **Score Range**: Min=1.0, Max=7.0 ✅
4. **Null Values**: Check for missing scores (acceptable)

### **Post-Transformation Validation**

1. **Respondent Count**: Should have ~8,127 rows after pivot ✅
2. **Construct Completeness**: Each respondent should have ≤32 construct scores ✅
3. **Duplicate Check**: No duplicate `respondent_id` in output ✅
4. **Score Integrity**: Averages calculated correctly ✅

### **Database Integration Validation**

```sql
-- Check total respondents with capability data
SELECT COUNT(*) FROM respondents WHERE construct_1 IS NOT NULL;
-- Expected: ~8,127

-- Check company distribution
SELECT company_id, COUNT(*) FROM respondents
WHERE construct_1 IS NOT NULL
GROUP BY company_id;
-- Expected: ~2,700 per company

-- Check score ranges
SELECT
  MIN(construct_1) as min_c1, MAX(construct_1) as max_c1,
  MIN(construct_32) as min_c32, MAX(construct_32) as max_c32
FROM respondents;
-- Expected: 1.0 ≤ scores ≤ 7.0
```

---

## 🚀 Execution Steps

### **1. Run Transformation Script**
```bash
cd /Users/Dev/Desktop/ainavigator
python scripts/transform_capability_data.py
```

**Output**:
- `data-foundation/capability_demo_wide.csv` - Pivoted data
- `logs/transformation_report.txt` - Validation summary

### **2. Apply Database Migration**
```bash
# Add new columns (industry, continent)
npm run db:migrate
```

### **3. Import Transformed Data**
```bash
python scripts/import_capability_wide.py
```

**Alternative** (if using Supabase SQL Editor):
```sql
COPY respondents(respondent_id, company_id, industry, continent, region, employment_type, construct_1, ..., construct_32)
FROM '/path/to/capability_demo_wide.csv'
DELIMITER ','
CSV HEADER;
```

### **4. Verify Integration**
```bash
# Run validation queries
npm run db:validate
```

---

## 📊 Benchmark Impact

### **Before Transformation**

- ❌ No capability benchmarks possible
- ❌ Cannot compare companies on 8 dimensions
- ❌ Missing industry/continent filters

### **After Transformation**

- ✅ Capability benchmarks for 8 dimensions
- ✅ Region, department, AND industry filtering
- ✅ Company percentile rankings
- ✅ Dimension-level gap analysis

**New Benchmark Queries Enabled**:
```typescript
GET /api/benchmarks/capability?region=Europe&industry=Financial%20Services
GET /api/benchmarks/overview?department=IT&industry=Technology
```

---

## 🎨 Frontend Integration

### **Updated Data Flow**

```
1. User logs in → company_id retrieved
2. Frontend fetches: GET /api/data/respondents (company_id header)
3. Response includes BOTH:
   - sentiment_1...sentiment_25 (25 columns)
   - construct_1...construct_32 (32 columns)
4. Calculate heatmap from sentiment scores
5. Calculate diamond chart from construct scores (aggregated by dimension)
6. Fetch benchmarks: GET /api/benchmarks/overview
7. Display comparison: Company vs Industry Average vs Regional Average
```

### **UI Components Updated**

- `components/SentimentHeatmap.tsx` - No changes needed ✅
- `components/CapabilityDiamond.tsx` - Reads construct_1...32 ✅
- `components/BenchmarkComparison.tsx` - NEW component for benchmark display
- `lib/calculations/capability-analysis.ts` - Already supports wide format ✅

---

## ⚠️ Known Limitations & Future Work

### **Current Limitations**

1. **Static Company Assignment**: Respondents distributed via hash, not real company matching
2. **No Respondent Overlap**: Sentiment and capability respondents are distinct (no shared respondents yet)
3. **Synthetic Metadata**: Industry/continent are synthetic, not real survey data

### **Future Enhancements** (Post-MVP)

1. **True Respondent Matching**: Match sentiment + capability by actual RespondentID
2. **Real Metadata Integration**: Replace synthetic fields with actual company/role data
3. **Live Data Pipeline**: Automate transformation for new data uploads
4. **Incremental Updates**: Support partial data updates without full re-import

---

## 📚 Related Documentation

- [CSV Schema Definition](./csv_schema_definition.md) - Column specifications
- [Data Model](./data_model.md) - Logical 3NF structure
- [Database Migrations](../supabase/migrations/) - SQL migration files
- [Benchmark Service](../lib/services/benchmark.service.ts) - Calculation logic

---

## 🤝 Team Notes

**For Data Scientists**:
- Future capability CSVs should follow the same long-format structure
- Construct IDs must remain stable (1-32 mapping)
- If adding new constructs, coordinate schema updates

**For Backend Developers**:
- Wide format optimized for read performance (MVP requirement)
- Consider adding a `capability_responses` table for analytics flexibility (Phase 2)
- Benchmark calculations run on-demand (no caching yet)

**For Frontend Developers**:
- All construct scores available in single API call
- Use `lib/constants/capability-metadata.ts` for dimension groupings
- Null construct scores indicate respondent didn't complete that construct

---

**Last Updated**: November 3, 2025
**Author**: AI Navigator Team
**Version**: 1.0 (Web Summit MVP)
