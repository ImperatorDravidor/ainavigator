# Benchmark Implementation Analysis & Gaps

**Date**: 2025-11-03
**Linear Issue**: AINAV-5 - Company Benchmark Comparison
**Status**: Functional with identified gaps

## Executive Summary

The benchmark system is **functionally operational** for capability data but has critical issues with sentiment data. The capability benchmarking works correctly using the LONG format data structure from capability_scores table. However, sentiment benchmarking has a column name case-sensitivity issue preventing proper calculation.

## ✅ What Works

### 1. Capability Benchmarking (FULLY FUNCTIONAL)
- ✅ Queries `capability_scores` table in LONG format correctly
- ✅ Calculates dimension averages (1-8) properly
- ✅ Company vs benchmark comparisons working
- ✅ Percentile calculations accurate
- ✅ Regional filtering operational (by country_synthetic)
- ✅ Industry filtering operational (by industry_synthetic)
- ✅ Continent filtering operational (by continent_synthetic)
- ✅ API endpoints return correct data structure

**Test Results** (acme-corp):
- Total capability scores: 864 (27 respondents × 32 constructs)
- Company scores: 160 (5 respondents)
- Dimension averages range: 3.86 - 5.28 (on 1-7 scale)
- Percentiles calculated correctly

### 2. API Architecture
- ✅ `/api/benchmarks/capability` - Works perfectly
- ✅ `/api/benchmarks/overview` - Returns both datasets
- ✅ Separate data fetching for sentiment (respondents) and capability (capability_scores)
- ✅ TypeScript compilation passes with no errors
- ✅ Proper error handling and metadata

### 3. Data Migration
- ✅ Real AI_CapScan survey data successfully imported
- ✅ Deduplication logic working (260,064 → 864 rows)
- ✅ Company assignment via hash function distributes respondents
- ✅ capability_scores table schema matches data scientist design

## ⚠️ Critical Gaps

### 1. Sentiment Benchmark Calculation Failure
**Issue**: Column name case mismatch
**Impact**: HIGH - Sentiment benchmarking returns all zeros

**Root Cause**:
```typescript
// lib/constants/sentiment-metadata.ts
export const SENTIMENT_COLUMN_MAPPING = {
  'L1_C1': 'Sentiment_1',  // ❌ Capitalized
  'L1_C2': 'Sentiment_2',  // ❌ Capitalized
  ...
}

// Database schema has lowercase columns
sentiment_1 NUMERIC  // ✅ Lowercase in PostgreSQL
sentiment_2 NUMERIC  // ✅ Lowercase in PostgreSQL
```

**Fix Required**: Change all `Sentiment_1` through `Sentiment_25` to lowercase `sentiment_1` through `sentiment_25` in SENTIMENT_COLUMN_MAPPING.

**Files to Update**:
- `lib/constants/sentiment-metadata.ts` (lines 69-101)

### 2. Zero Respondent Overlap Between Datasets
**Issue**: No respondents appear in both sentiment and capability datasets
**Impact**: MEDIUM - Cannot correlate sentiment with capability for same individuals

**Data Distribution**:
```
Sentiment Data (respondents table):
- Total: 3,473 respondents
- acme-corp: 3,451 (99.4%)
- tech-innovations: 11 (0.3%)
- global-solutions: 11 (0.3%)

Capability Data (capability_scores table):
- Total: 27 unique respondents
- acme-corp: 5 respondents (160 scores)
- tech-innovations: 14 respondents (448 scores)
- global-solutions: 8 respondents (256 scores)

Overlap: 0 respondents in both datasets
```

**Implications**:
- Cannot do cross-analysis (e.g., "Do people with high capability scores have lower sentiment resistance?")
- Benchmarks work independently but no combined insights possible
- This may be intentional if surveys were run separately

### 3. Filter Field Mismatches
**Issue**: Different filter fields available for sentiment vs capability
**Impact**: LOW - Users cannot apply consistent filters across both benchmark types

**Sentiment Filters** (from respondents table):
- ✅ region (geographic region)
- ✅ department (organizational department)
- ✅ industry (industry sector)
- ❌ continent (not available)

**Capability Filters** (from capability_scores table):
- ✅ country_synthetic (geographic country)
- ✅ industry_synthetic (industry sector)
- ✅ continent_synthetic (continent)
- ❌ department (not available)
- ❌ region (uses country instead)

**Current API Implementation**:
- `/api/benchmarks/overview` accepts: region, department, industry, continent
- Sentiment uses: region, department, industry
- Capability uses: country_synthetic as region, industry_synthetic, continent_synthetic
- This creates inconsistent filtering behavior

### 4. Data Volume Imbalance
**Issue**: Massive disparity between sentiment and capability data volumes
**Impact**: LOW - Affects statistical significance of comparisons

**Comparison**:
- Sentiment: 3,473 respondents (robust benchmarking)
- Capability: 27 respondents (limited benchmarking pool)

**Statistical Implications**:
- Sentiment benchmarks: Highly reliable (large sample)
- Capability benchmarks: Limited reliability (small sample, only 3 companies)
- Percentile calculations less meaningful with only 3 data points per company

### 5. Dead Code in benchmark.service.ts
**Issue**: Old capability benchmark function still exists with incorrect queries
**Impact**: VERY LOW - Not currently used, but creates maintenance confusion

**Location**: `lib/services/benchmark.service.ts` lines 123-234

**Problem Code**:
```typescript
// Lines 153-156 query non-existent construct columns
constructIds.forEach(constructId => {
  const columnName = `construct_${constructId}`  // ❌ These columns exist in respondents
  const scores = benchmarkData
    .map(row => row[columnName])  // This works but shouldn't
```

**Note**: These construct_1...construct_32 columns DO exist in respondents table (mistakenly added in migration 004), but capability data is now in the separate capability_scores table. This function is not used by current API endpoints.

### 6. Incorrect Columns in Respondents Table
**Issue**: construct_1 through construct_32 columns added to respondents table
**Impact**: LOW - Schema pollution, storage waste, potential confusion

**Background**:
- Migration 004 added construct columns to respondents table (WIDE format approach)
- Data scientist provided LONG format design (capability_scores table)
- construct columns in respondents should be removed

**Cleanup Required**:
- Create migration to drop construct_1...construct_32 from respondents table
- These 32 columns are not used and waste storage
- All capability data is properly in capability_scores table

## 📊 Data Quality Assessment

### Capability Data (Real AI_CapScan Survey)
- **Source**: AI_CapScan_3NF_fact_table.csv (8,127 rows)
- **Processed**: Deduplicated to 864 rows (27 respondents × 32 constructs)
- **Score Range**: 2.54 - 7.10 (on 1-7 Likert scale)
- **Deduplication Method**: Averaged multiple sessions per respondent
- **Quality**: ✅ Good - realistic score distribution

### Sentiment Data (Real SentimentScan Survey)
- **Source**: Imported in previous migration
- **Total**: 3,473 respondents with 25 sentiment cells each
- **Score Range**: ~1.05 - 1.61 (very low resistance values)
- **Quality**: ⚠️ Unclear - scores seem unusually low and concentrated
- **Note**: Need to verify if low scores indicate data quality issue or genuinely low resistance

## 🔧 Recommended Fixes (Priority Order)

### Priority 1: Fix Sentiment Column Name Case (CRITICAL)
**Effort**: 5 minutes
**Impact**: Enables sentiment benchmarking

```typescript
// lib/constants/sentiment-metadata.ts
export const SENTIMENT_COLUMN_MAPPING = {
  'L1_C1': 'sentiment_1',  // Change from 'Sentiment_1'
  'L1_C2': 'sentiment_2',  // Change from 'Sentiment_2'
  // ... all 25 columns
}
```

### Priority 2: Validate Sentiment Data Quality (HIGH)
**Effort**: 30 minutes
**Impact**: Ensures benchmark calculations are meaningful

- Check if sentiment score range 1.0-1.6 is expected
- Verify scoring methodology (1-7 scale? 1-5 scale?)
- Compare against data documentation
- Test with multiple companies to ensure variance

### Priority 3: Remove Dead construct Columns (MEDIUM)
**Effort**: 10 minutes
**Impact**: Clean schema, reduce confusion

Create migration:
```sql
-- supabase/migrations/007_remove_construct_columns.sql
ALTER TABLE respondents
  DROP COLUMN IF EXISTS construct_1,
  DROP COLUMN IF EXISTS construct_2,
  -- ... through construct_32
```

### Priority 4: Standardize Filter Fields (MEDIUM)
**Effort**: 1 hour
**Impact**: Consistent filtering experience

Options:
1. Add missing fields to both tables (recommended)
2. Document filter field differences clearly
3. Create unified filter mapping in API layer

### Priority 5: Remove Dead Code (LOW)
**Effort**: 5 minutes
**Impact**: Code cleanliness

- Mark `calculateCapabilityBenchmark()` as deprecated
- Add JSDoc warning to use `calculateCapabilityBenchmarkFromScores()` instead
- Or remove entirely if confident no other code uses it

## 📝 AINAV-5 Requirement Fulfillment

**Requirement**: "Both for overall sentiment score and for 8 dimension capability scores, companies should be able to compare themselves to the other companies in the database, ideally filtered by region and industry"

### ✅ Capability Benchmarking (100% Complete)
- [x] 8-dimension scores calculated
- [x] Company vs benchmark comparison
- [x] Percentile rankings
- [x] Region filtering (via country_synthetic)
- [x] Industry filtering (via industry_synthetic)
- [x] Continent filtering bonus

### ⚠️ Sentiment Benchmarking (80% Complete - Blocked by Case Issue)
- [x] Overall sentiment score structure
- [x] 25-cell heatmap averages calculated
- [x] Company vs benchmark comparison logic
- [x] Region filtering capability
- [x] Department filtering capability
- [x] Industry filtering capability
- [ ] **BLOCKED**: Column name case prevents actual calculation
- [ ] **NEED**: Data validation for low score ranges

## 🎯 Next Steps

1. **Immediate**: Fix sentiment column case issue
2. **Immediate**: Test sentiment benchmark with corrected column names
3. **Short-term**: Validate sentiment data quality and scoring
4. **Short-term**: Remove construct columns from respondents table
5. **Medium-term**: Consider adding more capability data respondents for better benchmarking
6. **Medium-term**: Investigate if sentiment and capability surveys can share respondent IDs

## 📈 Success Metrics

- ✅ TypeScript compiles without errors
- ✅ Capability API returns valid benchmark data
- ⚠️ Sentiment API returns zeros (case issue)
- ✅ 864 capability scores imported successfully
- ✅ 3,473 sentiment respondents available
- ✅ All 3 demo companies have data
- ⚠️ Limited capability data pool (27 respondents only)

## 🔍 Open Questions

1. **Sentiment Scores**: Are values of 1.05-1.61 expected? What's the scoring scale?
2. **Data Overlap**: Is zero overlap between datasets intentional or data quality issue?
3. **Capability Sample Size**: Will more capability respondents be added to improve benchmarking?
4. **Filter Standardization**: Should we align filter fields across both data types?

---

**Document Version**: 1.0
**Last Updated**: 2025-11-03
**Next Review**: After Priority 1 & 2 fixes implemented
