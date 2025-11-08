# Linear Issues - Testing Guide

**Updated**: 2025-11-03
**Total Issues**: 18 active (excluding 4 Linear onboarding tasks)

## Status Overview

- ✅ **COMPLETED & TESTABLE**: 1 issue (AINAV-5)
- 🟡 **PARTIALLY COMPLETE**: 1 issue (AINAV-10) - Backend done, UI integration pending
- 🔄 **IN PROGRESS**: 16 issues
- 🔴 **NOT STARTED**: 0 issues

---

## ✅ COMPLETED & READY TO TEST

### AINAV-5: Create Benchmarks ✅

**Status**: FULLY FUNCTIONAL

**What Was Implemented**:
- Sentiment benchmarking with percentile rankings
- Capability benchmarking across 8 dimensions
- Filter support (region, industry, department, continent)
- Real survey data (3,473 sentiment respondents, 27 capability respondents)

**Where to Test**:

1. **Start the dev server**:
   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

2. **Navigate to Assessment page**:
   - From homepage → "Enter Demo" button
   - Or directly: `http://localhost:3000/assessment`

3. **Test Sentiment Benchmarks**:
   - Look at the **Sentiment Heatmap** (5×5 grid)
   - The heatmap should show actual scores (NOT zeros)
   - Should show color-coded cells (green = low resistance, red = high resistance)
   - Scores should be between ~1.05 - 1.62 for acme-corp

4. **Test Capability Benchmarks**:
   - Switch to **Capability View** tab
   - Should see 8-dimension diamond/radar chart
   - Scores should range from ~2.54 - 7.10 on 1-7 scale
   - Should show percentile rankings vs other companies

5. **Test Filters**:
   - Use the filter controls at the top
   - Select different regions, departments, industries
   - Both sentiment and capability views should update
   - **Note**: Only acme-corp has sentiment data; all 3 companies have capability data

6. **API Endpoints to Test**:
   ```bash
   # Sentiment benchmarks
   curl "http://localhost:3000/api/benchmarks/overview?companyId=acme-corp"

   # Capability benchmarks
   curl "http://localhost:3000/api/benchmarks/capability?companyId=acme-corp"
   ```

**Expected Results**:
- ✅ Sentiment heatmap shows actual scores (not zeros)
- ✅ Capability chart shows 8 dimensions with scores
- ✅ Percentile rankings appear
- ✅ Filters update both views in real-time
- ✅ API returns JSON with benchmark data

**Files to Check**:
- `app/assessment/page.tsx` - Main assessment interface
- `components/sentiment/SentimentHeatmapRevised.tsx` - Heatmap display
- `lib/calculations/sentiment-ranking.ts` - Calculation logic
- `app/api/benchmarks/overview/route.ts` - Benchmark API

---

## 🟡 PARTIALLY COMPLETE

### AINAV-10: BIG ONE - NEW INTERVENTIONS 🟡

**Status**: DATA IMPORTED ✅ | UI INTEGRATION PENDING ⏳

**What Was Implemented**:
- ✅ Database schema for interventions
- ✅ 10 interventions imported (A1-A3, B1-B5, C1-C2)
- ✅ 25 sentiment heatmap cell mappings
- ✅ 8 capability dimension mappings
- ✅ Next-step progression logic
- ✅ Word document descriptions parsed
- ✅ 3 API endpoints created
- ✅ 2 React components built (InterventionModal, InterventionDetail)
- ⏳ **NOT YET**: Heatmap/capability clickability (needs integration)

**What You Can Test Now**:

1. **API Endpoints** (works now):
   ```bash
   # Get interventions for sentiment cell (L1×C1 = Personal × Autonomous)
   curl "http://localhost:3000/api/interventions/sentiment?level=1&category=1"

   # Get interventions for capability dimension (1 = Strategy & Vision)
   curl "http://localhost:3000/api/interventions/capability?dimension=1"

   # Get full intervention details
   curl "http://localhost:3000/api/interventions/A1"
   curl "http://localhost:3000/api/interventions/B1"
   curl "http://localhost:3000/api/interventions/C1"
   ```

2. **Database** (works now):
   ```sql
   -- View all interventions
   SELECT code, name, level FROM interventions ORDER BY code;

   -- View sentiment mappings
   SELECT level_id, category_id, primary_intervention_code
   FROM intervention_sentiment_mappings
   ORDER BY level_id, category_id;
   ```

**What's NOT Working Yet**:
- ❌ Clicking on heatmap cells (not wired up)
- ❌ Clicking on capability dimensions (not wired up)
- ❌ InterventionModal displaying on click
- ❌ InterventionDetail navigation

**Next Step to Complete**:
Need to add onClick handlers to:
- `components/sentiment/SentimentHeatmapRevised.tsx` - Make cells clickable
- Capability chart components - Make dimensions clickable

**Documentation**:
See `claudedocs/intervention_system_implementation.md` for complete details

---

## 🔄 IN PROGRESS - NOT YET TESTABLE

### AINAV-6: Sentiment Heat Map - Scores and Colours

**Issue**: "Ideally, the values and their layout would be flipped (again): the score in the DATA is 4 for the most negative and 1 for the most positive. In the DASHBOARD it would be ideal if the lowest possible score would be 1 and the highest 4 - the lowest 3 would be dark red"

**Current State**:
- Data has scores ~1.05-1.61 (very low range)
- Lower scores = less resistance = green
- Higher scores = more resistance = red
- Color logic uses relative ranking (top 3, top 8, middle, bottom 8, bottom 3)

**Investigation Needed**:
- Verify if current scale transformation is correct
- Current transformation: `(rawScore - 1.0) * 2.0 + 2.0` maps 1-2 range to 2-4 range
- Check if user wants different display scale

**File**: `lib/calculations/sentiment-ranking.ts:52-76`

---

### AINAV-7: Sentiment Scan Layout

**Issue**: "The totals for the rows and columns seem to be shifted in relation to the heatmap itself"

**What to Fix**:
- Column scores should be straight underneath columns
- Row scores should be straight next to rows
- Overall total next to column score AND underneath row score

**Where to Look**: `components/sentiment/SentimentHeatmapRevised.tsx` - Grid layout and totals positioning

**Status**: UI adjustment needed

---

### AINAV-8: Capability Graph - Layout

**Issue**: "In the light layout, the axes and titles of the capability graph aren't legible"

**What to Fix**: Text colors/contrast for light mode in capability radar/diamond chart

**Where to Look**:
- Capability chart component files
- Need to identify which component renders the capability visualization

**Status**: Need to locate capability chart component and adjust light mode colors

---

### AINAV-9: AI Shell (Start Screen)

**Issue**: "One of the predefined questions is about maturity across '7 capability dimensions'. There are 8"

**What to Fix**: Simple text change from "7" to "8" in AI shell predefined questions

**Where to Look**:
- AI chat/shell component on start screen
- Search for text containing "7 capability dimensions"

**Status**: Simple text fix needed

---

### AINAV-11: Lower Levels in Capability Scan

**Issue**: "It would be really good if the smaller spider web graphs in the capability scan would also show scores (they are all the same now)"

**Technical Detail**:
- Currently showing 8 dimensions (top level)
- Need to show construct-level scores (32 constructs, 4 per dimension)
- Data exists in `capability_scores` table

**What to Implement**:
- Drill-down from dimension to construct level
- 8 smaller charts showing 4 constructs each

**Status**: Requires component enhancement to show construct-level detail

---

### AINAV-12: NLP for Capabilities (and in General)

**Issue**: "The capability scan includes 3 open-ended questions. These should be reported on using a NLP analysis. Would it be nice to also include some general NLP analyzer in the start screen?"

**What to Implement**:
- NLP analysis for open-ended capability questions
- Optional: General NLP analyzer on start screen

**Status**: Need to locate open-ended question data in capability survey structure

---

### AINAV-13: Sentiment and Capability Scans

**Issue**: Confirmation that respondents are different groups (capability = expert assessors, sentiment = broad employee base)

**Status**: ✅ THIS IS BY DESIGN - Already documented
- Sentiment: 3,473 respondents
- Capability: 27 respondents
- Zero overlap (intentional)

**Action**: Update documentation to confirm this is correct architecture

---

### AINAV-14: Intervention Suggestions from AI Shell

**Issue**: "If users enter the navigator in the AI shell - which is great - they are invited to find interventions for their situation. These must align with the types we described ourselves."

**What to Implement**:
- AI shell should suggest interventions from the 10 we imported
- Include context: 8 dimensions, 3 levels (strategic, adoption, innovation)

**Status**: Requires AI shell integration with intervention system

---

### AINAV-15: General: Feeding the AI Shell

**Issue**: "It now seems the AI shell gives random suggestions, not linked to our models or the data. How can we improve on this?"

**What to Implement**:
- RAG (Retrieval Augmented Generation) with company data
- System prompts with model context (8 dimensions, 5×5 heatmap)
- Real-time data injection into AI context

**Status**: Requires AI model integration and context enhancement

---

### AINAV-16: BIG ONE - DATA UPDATES ⭐ CRITICAL

**Issue**: "Right now, we seem to work with static data. But for the demo to work, we must be able to refresh data - either by uploading a data set or by retrieving extra data from the database. Newer data must show a development, preferably in the right direction, after interventions have taken place."

**What to Implement**:
- Temporal data structure (timestamps, versions, or waves)
- Before/after comparison capability
- Data upload UI or API
- Timeline visualization to show progress
- Date filtering to show development over time

**Status**: Major feature - requires database schema updates and new UI

---

### AINAV-17: Filter in Capability View

**Issue**: "When filtered, the capability view shows no results"

**Potential Causes**:
- Filter field mismatch (region vs country_synthetic, department not in capability data)
- Frontend sending wrong filter parameters
- Backend not handling filters correctly
- Limited capability data (only 27 respondents) may not match filter criteria

**Status**: Investigation needed on filter parameter passing

---

### AINAV-18: Command Center and Detailed Reports

**Issue**: "The data in the command center doesn't seem to align with the data in the detailed report - specifically the sentiment and capability scores are completely different"

**Investigation Needed**:
- Command center may be using different calculation method
- May be using old benchmark service vs new one
- Filter state may not be synchronized
- Need to verify data source consistency

**Status**: Root cause analysis required

---

### AINAV-19: Complete Run Through for Demo Hosts

**Issue**: "Right now, I feel not every functionality is completely intuitive - even how to get to the demo needs a bit of explanation. Can we create a complete run through (video?) of how it works?"

**Deliverables Needed**:
- Step-by-step demo guide
- Video walkthrough (optional)
- User flow documentation for demo presenters

**Status**: Documentation task

---

### AINAV-20: Landing Page Positioning

**Issue**: "If you go to the platform, it's not obvious what's on the landing page. It looks like it's mainly about going to the demo. This is caused by the fact that the content of the landing page is off screen"

**What to Fix**: Adjust landing page layout/viewport to show full content without scrolling

**Where to Look**: Landing page component (likely `app/page.tsx` or similar)

**Status**: UI layout adjustment needed

---

### AINAV-21: URL

**Issue**: "We would really like the url for the demo to be navigator.leadingwith.ai"

**What's Needed**:
- Domain configuration
- DNS setup
- Deployment platform configuration (Vercel custom domain)
- SSL certificate

**Status**: Infrastructure/DevOps task

---

### AINAV-22: Mobile Views?

**Issue**: "Doesn't really work now - can we make it work?"

**What to Implement**: Responsive design for all key views (heatmap, capability chart, interventions, etc.)

**Status**: UI/UX responsive design work needed

---

## Quick Testing Checklist

### What You Can Test Right Now:

1. **Sentiment Heatmap Functionality** ✅
   - Navigate to `/assessment`
   - Should see heatmap with actual scores (not zeros)
   - Test filters
   - Verify colors are correct

2. **Benchmark APIs** ✅
   - Test via curl commands above
   - Should return JSON with percentile data

3. **Intervention APIs** ✅ (NEW)
   - Test 3 endpoints via curl
   - Should return intervention data with descriptions

### What You CANNOT Test Yet:

1. ❌ Clicking heatmap cells to see interventions
2. ❌ Clicking capability dimensions to see interventions
3. ❌ Interactive intervention modals
4. ❌ Filtered capability views
5. ❌ Data upload/refresh functionality
6. ❌ Mobile responsive views
7. ❌ AI shell improvements
8. ❌ NLP analysis

---

## Priority Recommendations

Based on Linear priority and current state:

### 🔥 HIGH PRIORITY (Do Next)
1. **AINAV-10 Integration** - Wire up intervention modals to heatmap/capability clicks
2. **AINAV-18** - Investigate command center vs detailed report data mismatch
3. **AINAV-17** - Fix capability view filters
4. **AINAV-16** - Design temporal data structure for before/after tracking

### 🟡 MEDIUM PRIORITY (Polish)
5. **AINAV-6, 7, 8** - UI/visualization improvements
6. **AINAV-9** - Simple text fix (7→8 dimensions)
7. **AINAV-20** - Landing page layout
8. **AINAV-11** - Construct-level drilldown

### 🟢 LOWER PRIORITY (Can Wait)
9. **AINAV-15, 14** - AI shell enhancements
10. **AINAV-12** - NLP analysis
11. **AINAV-22** - Mobile responsiveness
12. **AINAV-19** - Demo documentation
13. **AINAV-21** - Custom domain setup

---

**Last Updated**: 2025-11-03
**Next Session Focus**: Complete AINAV-10 UI integration, then investigate AINAV-18
