# Linear Issues Overview - AI Navigator

**Project**: Phase 1 - Web Summit Demo (AI NAVIGATOR)
**Target Date**: October 26, 2025
**Total Issues**: 22 (18 active work items, 4 Linear onboarding tasks)

## Project Summary

**Goal**: Showcase an interactive demo that helps organizations assess **AI readiness** — combining **sentiment insights** (how people feel) and **capability maturity** (how ready they are) with guided actions and a directional ROI glimpse.

**Success Criteria**:
- Full 3-min interactive demo runs smoothly
- Visuals update dynamically with data/filters
- Interventions feel relevant, ROI believable
- Export works cleanly
- Feels intelligent, professional, and demo-ready

---

## Issues by Category

### ✅ COMPLETED

#### AINAV-5: Create benchmarks
**Status**: COMPLETE (just finished)
**Priority**: High
**Description**: Both for overall sentiment score and for 8 dimension capability scores, companies should be able to compare themselves to the other companies in the database, ideally filtered by region and industry

**Implementation**:
- ✅ Sentiment benchmarking functional
- ✅ Capability benchmarking functional (8 dimensions)
- ✅ Region filtering working
- ✅ Industry filtering working
- ✅ Real survey data imported (864 capability scores, 3,473 sentiment respondents)
- ✅ API endpoints operational

**Files**: `lib/services/capability-benchmark.service.ts`, `app/api/benchmarks/capability/route.ts`, `app/api/benchmarks/overview/route.ts`

---

### 🔴 HIGH PRIORITY - DATA & FUNCTIONALITY

#### AINAV-16: BIG ONE - DATA UPDATES ⭐ CRITICAL
**Status**: In Progress
**Priority**: High
**Created**: 2025-11-03

**Requirements**:
- Right now, we work with static data. For demo to work, we must be able to refresh data
- Either by uploading a dataset OR by retrieving extra data from database
- Newer data must show development (preferably positive) after interventions
- Ideally, filter reports by date to show development over time
- **Must be demo ready**

**Implications**:
- Need temporal data structure (timestamps, versions, or waves)
- Need before/after comparison capability
- May need data upload UI or API
- Timeline visualization to show progress

**Technical Notes**:
- Currently no `created_at` or `wave` field in capability_scores
- Respondents table has `created_at` but not used for filtering
- Need to design how to show "improvement after intervention"

---

#### AINAV-18: Command center and detailed reports
**Status**: In Progress
**Priority**: High
**Created**: 2025-11-03

**Issue**: The data in the command center doesn't align with the data in detailed reports - specifically the sentiment and capability scores are completely different

**Root Cause Analysis Needed**:
- Command center may be using different calculation method
- May be using old benchmark service vs new one
- Filter state may not be synchronized
- Need to verify data source consistency

**Files to Check**: Command center component, detailed report components

---

#### AINAV-17: Filter in Capability view
**Status**: In Progress
**Priority**: High
**Created**: 2025-11-03

**Issue**: When filtered, the capability view shows no results

**Potential Causes**:
- Filter field mismatch (region vs country_synthetic, department not in capability data)
- Frontend sending wrong filter parameters
- Backend not handling filters correctly
- No data matches filter criteria (possible with limited capability data - only 27 respondents)

**Investigation Needed**: Check filter parameters being sent from frontend to capability API

---

#### AINAV-13: Sentiment and capability scans ✅ CONFIRMATION
**Status**: In Progress
**Priority**: High
**Created**: 2025-11-02

**Confirmation**: The respondents of the capability scan and sentiment scan will generally be different groups:
- **Capability scan**: Done by limited number of respondents with meaningful insight
- **Sentiment scan**: Done by large groups of employees across all levels

**Current Reality**: ✅ This is exactly how our data is structured
- Sentiment: 3,473 respondents (broad employee base)
- Capability: 27 respondents (expert assessors)
- Zero overlap (as expected)

**Action**: Update documentation to reflect this is by design, not a bug

---

### 🎨 UI/VISUALIZATION ISSUES

#### AINAV-6: Sentiment heat map - scores and colours
**Status**: In Progress
**Priority**: High
**Created**: 2025-11-02

**Requirements**:
- Score in DATA: 4 = most negative, 1 = most positive
- In DASHBOARD: Flip so lowest score = 1, highest = 4
- Lowest 3 scores should be dark red (most negative)

**Current State**:
- Data has scores ~1.05-1.61 (very low)
- Color logic uses `getRankedColor()` in `sentiment-metadata.ts`
- Lower scores = better (less resistance) = green
- Higher scores = worse (more resistance) = red

**Action Needed**: Verify if current implementation matches requirements or needs adjustment

---

#### AINAV-7: Sentiment scan layout
**Status**: In Progress
**Priority**: High
**Created**: 2025-11-02

**Issue**: The totals for rows and columns seem to be shifted in relation to the heatmap
- Column scores should be straight underneath columns
- Row scores should be straight next to rows
- Overall total next to column score AND underneath row score (as in Excel)

**Action**: Frontend layout adjustment for sentiment heatmap component

---

#### AINAV-8: Capability graph - layout
**Status**: In Progress
**Priority**: High
**Created**: 2025-11-02

**Issue**: In light layout, the axes and titles of the capability graph aren't legible

**Action**: Adjust text colors/contrast for light mode in capability radar/diamond chart

---

#### AINAV-11: Lower levels in Capability scan
**Status**: In Progress
**Priority**: High
**Created**: 2025-11-02

**Issue**: The smaller spider web graphs in the capability scan all show the same scores now (they should show different construct-level scores)

**Technical Note**: Currently showing 8 dimensions. Each dimension has 4 constructs. Need to drill down to construct level (32 total constructs)

**Data Available**: We have all 32 construct scores in capability_scores table

---

### 🤖 AI SHELL ISSUES

#### AINAV-15: General: feeding the AI shell ⭐ IMPORTANT
**Status**: In Progress
**Priority**: High
**Created**: 2025-11-03

**Issue**: AI shell gives random suggestions, not linked to our models or data. How can we improve?

**Requirements**:
- AI suggestions should be based on actual data
- Link to capability dimensions and sentiment analysis
- Use our specific models and frameworks
- Provide relevant, data-driven insights

**Technical Approach Needed**:
- RAG (Retrieval Augmented Generation) with company data
- System prompts with model context (8 dimensions, 5×5 heatmap)
- Real-time data injection into AI context

---

#### AINAV-14: Intervention suggestions from AI shell
**Status**: In Progress
**Priority**: High
**Created**: 2025-11-03

**Requirements**:
- Users enter navigator via AI shell (great!)
- Invited to find interventions for their situation
- Must align with intervention types we described
- Extra prompting with:
  - 8 dimensions of capability scan
  - 3 levels: strategic, adoption, innovation

**Integration**: Connect to AINAV-10 (new interventions)

---

#### AINAV-12: NLP for capabilities (and in general)
**Status**: In Progress
**Priority**: High
**Created**: 2025-11-02

**Requirements**:
- Capability scan includes 3 open-ended questions
- Should be reported using NLP analysis
- **Bonus**: General NLP analyzer in start screen
  - Ask: "Tell me about your AI Adoption"
  - Link outcomes to our models

**Technical Note**: Need to locate open-ended question data in capability survey structure

---

#### AINAV-9: AI Shell (start screen)
**Status**: In Progress
**Priority**: High
**Created**: 2025-11-02

**Issue**: One predefined question mentions '7 capability dimensions'. There are **8 dimensions**.

**Action**: Simple text fix in AI shell predefined questions

**Dimensions**: Strategy & Vision, Data, Technology, Talent & Skills, Organisation & Processes, Innovation, Adaptation & Adoption, Ethics & Responsibility

---

### 📊 INTERVENTIONS

#### AINAV-10: BIG ONE - NEW INTERVENTIONS ⭐ MAJOR FEATURE
**Status**: In Progress
**Priority**: High
**Created**: 2025-11-02

**Current State**: 75 interventions already added to Heat Map

**New Requirements**:
- Define 10 larger-scale interventions (more commercial focus)
- 3 levels: **Strategic, Adoption, Innovation**
- For each sentiment heatmap area (25 cells): assign 3 most useful interventions
- For each capability dimension (8 dimensions): assign 3 most useful interventions
- Make heatmap areas and spider web dimensions **clickable** → lead to interventions
- Show intervention descriptions (from Word docs)
- Show logical next steps for each intervention

**Data Source**: Google Drive folder with:
- Excel file with 4 sheets:
  1. Overview of interventions by level
  2. 3 interventions per heatmap area (25 areas)
  3. 3 interventions per capability dimension (8 dimensions)
  4. 3 logical next steps per intervention
- Word files with intervention descriptions

**Technical Implementation Needed**:
- Database schema for interventions
- Mapping interventions to heatmap cells and capability dimensions
- Interactive click handlers on visualizations
- Intervention detail view/modal
- Next steps workflow

---

### 📱 UX/POLISH ISSUES

#### AINAV-20: Landing page positioning
**Status**: In Progress
**Priority**: High
**Created**: 2025-11-03

**Issue**: Landing page content is off-screen. Not obvious that home page offers more than just demo access.

**Action**: Adjust landing page layout/viewport to show full content without scrolling

---

#### AINAV-22: Mobile views?
**Status**: In Progress
**Priority**: High
**Created**: 2025-11-03

**Issue**: Doesn't work on mobile now - can we make it work?

**Scope**: Responsive design for all key views (heatmap, capability chart, interventions, etc.)

**Priority Note**: User says "doesn't really work now" - so likely low functionality, not complete breakage

---

### 🔧 INFRASTRUCTURE

#### AINAV-21: URL
**Status**: In Progress
**Priority**: High
**Created**: 2025-11-03

**Request**: Want URL for demo to be `navigator.leadingwith.ai`

**Requirements from user**: "Let me know what we need for that"

**Action Items**:
- Domain configuration
- DNS setup
- Deployment platform configuration (Vercel custom domain)
- SSL certificate

---

### 📚 DOCUMENTATION

#### AINAV-19: Complete run through for demo hosts
**Status**: In Progress
**Priority**: High
**Created**: 2025-11-03

**Issue**: Not every functionality is completely intuitive - even getting to demo needs explanation

**Request**: Create complete run through (video?) of how it works

**Deliverables**:
- Step-by-step demo guide
- Video walkthrough (optional)
- User flow documentation for demo presenters

---

### 🗑️ IGNORE (Linear Onboarding)

These are default Linear setup tasks and can be ignored:
- **AINAV-1**: Get familiar with Linear
- **AINAV-2**: Set up your teams
- **AINAV-3**: Connect your tools
- **AINAV-4**: Import your data

---

## Priority Matrix

### 🔥 CRITICAL (Do First)
1. **AINAV-16**: Data updates (temporal data, before/after)
2. **AINAV-10**: New interventions (major feature, Google Drive data)
3. **AINAV-18**: Command center vs detailed reports data mismatch
4. **AINAV-15**: AI shell data integration

### 🟡 HIGH (Do Soon)
5. **AINAV-17**: Filter in capability view
6. **AINAV-14**: AI intervention suggestions
7. **AINAV-11**: Construct-level capability graphs
8. **AINAV-12**: NLP for open-ended questions

### 🟢 MEDIUM (Polish)
9. **AINAV-6**: Sentiment heatmap colors
10. **AINAV-7**: Sentiment layout alignment
11. **AINAV-8**: Capability graph light mode
12. **AINAV-9**: AI shell text (7→8 dimensions)
13. **AINAV-20**: Landing page positioning
14. **AINAV-22**: Mobile responsive views
15. **AINAV-19**: Demo guide/video

### 🔵 LOW (Infrastructure)
16. **AINAV-21**: Custom domain setup
17. **AINAV-13**: Documentation update (already correct)

---

## Technical Dependencies

### Data Architecture Needs
- **Temporal structure** for AINAV-16 (versions, waves, timestamps)
- **Interventions schema** for AINAV-10 (interventions table, mappings)
- **NLP data** for AINAV-12 (open-ended responses)

### Integration Points
- **AI Shell** (AINAV-9, 14, 15) needs:
  - Real-time data context
  - Model framework prompts
  - Intervention database
  - RAG implementation

### Visualization Updates
- **Sentiment Heatmap**: AINAV-6 (colors), AINAV-7 (layout), AINAV-10 (clickable)
- **Capability Chart**: AINAV-8 (light mode), AINAV-11 (construct drilldown), AINAV-10 (clickable)
- **Command Center**: AINAV-18 (data consistency)

---

## Recommended Work Sequence

### Phase A: Critical Data Foundation (Week 1)
1. Investigate AINAV-18 (data mismatch) - may reveal systemic issues
2. Design temporal data structure for AINAV-16
3. Import Google Drive interventions data for AINAV-10

### Phase B: Core Functionality (Week 2)
4. Implement intervention clickability and detail views (AINAV-10)
5. Fix capability filter issue (AINAV-17)
6. Implement construct-level drilldown (AINAV-11)
7. Integrate AI shell with real data (AINAV-15)

### Phase C: Polish & UX (Week 3)
8. Fix visualization layouts (AINAV-6, 7, 8)
9. Mobile responsiveness (AINAV-22)
10. Landing page adjustment (AINAV-20)
11. AI shell text fixes (AINAV-9)
12. Intervention AI suggestions (AINAV-14)

### Phase D: Final Touches (Week 4)
13. NLP implementation (AINAV-12)
14. Demo guide/video (AINAV-19)
15. Custom domain setup (AINAV-21)
16. Final testing and bug fixes

---

## Open Questions

1. **AINAV-16**: What format should temporal data take? Waves? Versions? Date ranges?
2. **AINAV-10**: Who will create intervention content? Is Google Drive data ready?
3. **AINAV-12**: Where is the open-ended question data? Is it already in the database?
4. **AINAV-18**: What calculations are the command center using vs detailed reports?
5. **AINAV-15**: What AI model/service are we using? Do we have API access?

---

**Last Updated**: 2025-11-03
**Completed This Session**: AINAV-5 (Benchmarks)
**Next Priority**: AINAV-16 (Data Updates) or AINAV-18 (Data Mismatch Investigation)
