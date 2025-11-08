
# AI Navigator MVP - Sprint Plan
**Web Summit Demo Delivery**

## Timeline Overview
- **Start Date:** October 22, 2025
- **Target Completion:** October 26-27, 2025
- **Duration:** 4-5 days
- **Milestones:** 4

---

## Milestone 1: Foundation & Data Infrastructure
**Target Date:** Day 1 (October 22, 2025)

### Objectives
Establish the technical foundation, project architecture, and data ingestion pipeline to support all downstream modules.

### Deliverables

#### 1.1 Project Setup & Architecture
- [ ] Initialize Next.js project structure (already done)
- [ ] Set up TypeScript configurations
- [ ] Configure backend API routes structure
- [ ] Establish folder architecture for modules (components, services, types, utils)
- [ ] Install and configure essential dependencies:
  - Chart libraries (recharts or similar for radar/heatmap)
  - PDF generation library (react-pdf or jsPDF)
  - CSV parsing library (papaparse)
  - State management (zustand or context)

#### 1.2 Data Upload & Processing Module (Section 6.1)
- [ ] **Frontend: CSV Upload Interface**
  - File upload component with drag-and-drop
  - File validation UI (format checking)
  - Upload progress indicator
  - Error messaging display
  
- [ ] **Backend: CSV Processing API**
  - POST `/api/upload` endpoint
  - CSV parsing and validation logic
  - Structure validation against expected schema:
    - Sentiment responses (25 areas)
    - Capability scores (32 constructs)
    - Open-ended text responses
    - Metadata fields (region, function, age group, etc.)
  - Error handling and detailed error responses
  - Session-based data storage (in-memory or temporary)

#### 1.3 Data Models & Type Definitions
- [ ] Define TypeScript interfaces for:
  - Raw CSV data structure
  - Processed sentiment data
  - Processed capability data
  - Filter metadata
  - Aggregated results
  - Benchmark data structure
  - Intervention definitions
- [ ] Create data transformation utilities
- [ ] Build aggregation helper functions (averages, min/max)

#### 1.4 Sample Dataset Preparation
- [ ] Coordinate with data scientist for CSV structure specification
- [ ] Create or receive sample datasets:
  - Sample sentiment dataset (demo-ready)
  - Sample capability dataset (demo-ready)
  - Benchmark reference data
- [ ] Document expected data schema

### Success Criteria
- ✅ User can upload a CSV file
- ✅ System validates and parses CSV correctly
- ✅ Error states display clearly for invalid uploads
- ✅ Parsed data is accessible to backend logic
- ✅ Type system is robust and supports all data flows

---

## Milestone 2: Sentiment Flow & Visualization
**Target Date:** Day 2 (October 23, 2025)

### Objectives
Implement the complete sentiment analysis journey including the 25-zone heatmap, filtering, and interactive exploration.

### Deliverables

#### 2.1 Sentiment Heatmap Visualization (Section 6.2)
- [ ] **Heatmap Component**
  - 5×5 grid layout (25 sentiment areas)
  - Color gradient implementation (red → yellow → green)
  - Responsive cell sizing
  - Hover states and tooltips
  - Click handlers for cell selection
  
- [ ] **Sentiment Area Definition**
  - Configure 25 predefined sentiment areas
  - Define labels, descriptions, and coordinates
  - Map sentiment level (rows) × reason (columns)
  
- [ ] **Backend: Sentiment Aggregation API**
  - GET `/api/sentiment/heatmap` endpoint
  - Calculate average scores per sentiment area
  - Apply color coding logic
  - Return structured heatmap data

#### 2.2 Sentiment Detail View
- [ ] Modal or side panel component
- [ ] Display area-specific information:
  - Title and description
  - Current average score
  - Visual indicator (score bar or gauge)
  - Benchmark comparison (if available)
  - Number of respondents in this area
- [ ] "View Recommendations" action button

#### 2.3 Basic Filtering System (Section 6.4 - Part 1)
- [ ] **Filter UI Component**
  - Filter panel/sidebar
  - Dropdown selectors for:
    - Region
    - Business function
    - Age group (if available)
    - Department
  - "Apply Filters" and "Reset" actions
  
- [ ] **Backend: Filter Application**
  - POST `/api/filter/apply` endpoint
  - Filter state management
  - Recalculate sentiment aggregations based on filtered subset
  - Return updated heatmap data

#### 2.4 Navigation Foundation
- [ ] Landing page with flow selection (Sentiment vs Capability)
- [ ] Entry point for data upload or demo dataset selection
- [ ] Basic navigation between views

### Success Criteria
- ✅ User can view a 25-cell sentiment heatmap
- ✅ Heatmap colors reflect data-driven scores
- ✅ Clicking a cell shows detailed information
- ✅ Applying filters recalculates and updates heatmap
- ✅ Navigation between landing and sentiment view works smoothly

---

## Milestone 3: Capability Flow & Advanced Features
**Target Date:** Day 3 (October 24, 2025)

### Objectives
Build the two-level capability assessment visualization, construct drilldown, benchmarking logic, and AI-based summarization.

### Deliverables

#### 3.1 Capability Diamond - Top Level (Section 6.3)
- [ ] **8-Dimension Radar Chart**
  - Radar/spider chart component
  - 8 axes for capability dimensions:
    1. Strategy and Vision
    2. Data
    3. Technology
    4. Talent and Skills
    5. Organisation and Processes
    6. Innovation
    7. Adaptation & Adoption
    8. Ethics and Responsibility
  - Display average scores per dimension
  - Optional: min/max range visualization (shaded areas)
  
- [ ] **Backend: Dimension Aggregation**
  - GET `/api/capability/dimensions` endpoint
  - Calculate dimension averages (from 4 constructs each)
  - Calculate min/max scores per dimension
  - Apply filters to capability dataset

#### 3.2 Capability Diamond - Construct Level
- [ ] **4-Construct Radar Chart**
  - Second-level radar view (drilldown)
  - Display when dimension is clicked
  - Show 4 constructs for selected dimension
  - Calculate construct-level averages
  
- [ ] **Backend: Construct Aggregation**
  - GET `/api/capability/constructs/:dimensionId` endpoint
  - Return 4 construct scores for specified dimension
  - Identify weakest constructs
  - Apply active filters

#### 3.3 Benchmarking Logic (Section 6.4 - Part 2)
- [ ] **Benchmark Data Integration**
  - Load benchmark datasets (industry + region based)
  - Define benchmark structure (averages by dimension/construct)
  
- [ ] **Benchmark Visualization**
  - Overlay benchmark polygon/line on radar charts
  - Show benchmark comparison in detail views
  - Visual distinction (dashed line, different color)
  
- [ ] **Backend: Benchmark Comparison**
  - GET `/api/benchmark/:industry/:region` endpoint
  - Match uploaded data to appropriate benchmarks
  - Calculate gap analysis (current vs benchmark)
  - Handle missing benchmark data gracefully

#### 3.4 Open-Ended Response Summarization (Section 7.7)
- [ ] **AI Summarization Integration**
  - Integrate with OpenAI API or similar
  - Aggregate filtered open-text responses
  - Generate 3-5 key insights or short paragraph
  
- [ ] **Backend: Summarization API**
  - POST `/api/capability/summarize` endpoint
  - Filter open-ended responses by active segment
  - Call AI service with appropriate prompt
  - Cache results per filter combination
  - Display loading state during generation
  
- [ ] **Frontend: Summary Display**
  - Summary panel in capability view
  - Update when filters change
  - Loading indicator

#### 3.5 Filter System - Full Implementation
- [ ] Extend filtering to capability flow
- [ ] Synchronize filter state across sentiment and capability views
- [ ] Real-time recalculation on filter changes
- [ ] Empty state handling ("No data available for selected segment")

### Success Criteria
- ✅ User can view 8-dimension radar chart with data-driven values
- ✅ Clicking a dimension loads 4-construct drilldown view
- ✅ Benchmark comparisons visible on radar charts
- ✅ Open-ended responses generate AI summary
- ✅ Filters affect both sentiment and capability flows
- ✅ System identifies and highlights weak dimensions/constructs

---

## Milestone 4: Interventions, ROI & Finalization
**Target Date:** Days 4-5 (October 25-26, 2025)

### Objectives
Complete the recommendation engine, ROI glimpse, PDF export, end-to-end flow integration, and demo polish.

### Deliverables

#### 4.1 Spotlight Interventions (Section 6.5)
- [ ] **Intervention Definition & Configuration**
  - Define 3-5 spotlight interventions
  - Structure for each intervention:
    - Title
    - 2-3 paragraph description
    - Target impact areas (sentiment/capability)
    - Relevant dimensions/constructs
    - ROI impact factors
  - Store as configuration or database records
  
- [ ] **Intervention Recommendation Logic**
  - Backend: POST `/api/interventions/recommend` endpoint
  - Rule-based trigger evaluation:
    - Sentiment area below threshold → suggest relevant interventions
    - Capability construct significantly below benchmark → suggest relevant interventions
  - Return ranked list of 1-2 most relevant interventions
  
- [ ] **Intervention Detail View**
  - Full-page or modal view for intervention deep-dive
  - Display complete intervention documentation
  - Show which gaps it addresses
  - Link to ROI glimpse
  - "View ROI Impact" action button

#### 4.2 ROI Glimpse Feature (Section 6.6)
- [ ] **ROI Calculation Logic**
  - Define directional improvement estimates per intervention
  - Format: percentage ranges (e.g., "8-15% efficiency improvement")
  - Link to specific capability/sentiment improvements
  
- [ ] **ROI Glimpse View**
  - Clean, professional presentation
  - Short explanation paragraph
  - Visual indicators (range bars, percentage displays)
  - Connect to selected intervention context
  - Feel data-driven and credible (not generic)
  
- [ ] **Backend: ROI API**
  - GET `/api/roi/:interventionId` endpoint
  - Return tailored ROI glimpse based on:
    - Selected intervention
    - Current capability/sentiment gaps
    - Organization's specific context

#### 4.3 PDF Export (Section 6.7)
- [ ] **Export Data Compilation**
  - Backend: POST `/api/export/pdf` endpoint
  - Compile export payload:
    - Selected flow (Sentiment or Capability)
    - Latest heatmap or capability visual (as image/data)
    - Key insight summary
    - Selected spotlight intervention
    - ROI glimpse content
    - Applied filters and segment info
  
- [ ] **PDF Generation**
  - Professional layout template
  - Include:
    - Cover page with organization name
    - Sentiment or capability overview section
    - Visual representation (heatmap/radar)
    - Recommended action section
    - ROI potential summary
  - Download trigger and file naming
  
- [ ] **Frontend: Export Button**
  - Prominent "Export Summary (PDF)" button
  - Loading state during generation
  - Auto-download or preview options

#### 4.4 End-to-End Flow Integration (Section 6.8)
- [ ] **Complete User Journeys**
  - Sentiment Flow (Section 5.1):
    1. Upload/select → Heatmap → Filter → Click cell → View intervention → ROI → Export
  - Capability Flow (Section 5.2):
    1. Upload/select → Diamond → Filter → Click dimension → Constructs → Intervention → ROI → Export
  
- [ ] **Navigation Refinement**
  - Breadcrumb or progress indicator
  - "Back" navigation at each step
  - Clear CTAs ("View Recommendations", "Explore Actions", "See Impact")
  - Return to main view from any point
  
- [ ] **State Management**
  - Persist user selections through journey
  - Maintain filter state across views
  - Track selected sentiment area or capability dimension

#### 4.5 Demo Polish & Testing
- [ ] **Error Handling**
  - Comprehensive error states
  - Network failure handling
  - Empty data states ("No respondents match filters")
  - Missing benchmark graceful fallback
  
- [ ] **Loading States**
  - Skeleton screens for data loading
  - Progress indicators for AI summarization
  - Smooth transitions between views
  
- [ ] **Performance Optimization**
  - Recalculation speed optimization
  - Lazy loading for heavy components
  - Caching where appropriate
  
- [ ] **Visual Polish**
  - Consistent color scheme and typography
  - Professional executive-level aesthetic
  - Responsive layout (at least for demo device)
  - Smooth animations and transitions
  
- [ ] **Demo Dataset Integration**
  - Load pre-configured demo dataset as default
  - Ensure demo narrative flows smoothly:
    - "Here's how people feel about AI"
    - "Here's where capability gaps exist"
    - "Here's a high-impact action"
    - "Here's why it matters"

#### 4.6 Documentation & Handoff
- [ ] README with:
  - Setup instructions
  - Demo script/narrative
  - Data structure documentation
  - Known limitations
- [ ] Code comments for complex logic
- [ ] Environment variable configuration
- [ ] Deployment preparation (if needed)

### Success Criteria
- ✅ Complete end-to-end demo can be executed in < 3 minutes
- ✅ Spotlight interventions feel contextually relevant
- ✅ ROI glimpse provides meaningful value indication
- ✅ PDF export generates successfully with all key content
- ✅ Both sentiment and capability flows work flawlessly
- ✅ Demo runs without errors or awkward states
- ✅ Visual presentation is professional and impressive
- ✅ System demonstrates intelligence and interactivity

---

## Risk Management

### High-Priority Risks
1. **Data Structure Misalignment**
   - *Risk:* CSV structure provided by data scientist doesn't match implementation
   - *Mitigation:* Lock down data schema by end of Day 1; build validation early

2. **AI Summarization Latency**
   - *Risk:* OpenAI API calls too slow for live demo
   - *Mitigation:* Implement caching; consider pre-generating summaries for demo dataset

3. **Complex Visualization Performance**
   - *Risk:* Radar charts or heatmap rendering sluggish with real data
   - *Mitigation:* Test with full-size datasets early (Day 2-3); optimize rendering

4. **Scope Creep**
   - *Risk:* Attempting features beyond MVP scope
   - *Mitigation:* Strict adherence to PRD "Out of Scope" section; defer nice-to-haves

### Medium-Priority Risks
5. **PDF Generation Quality**
   - *Risk:* Generated PDFs look unprofessional
   - *Mitigation:* Start PDF template early (Day 3); iterate on layout

6. **Benchmark Data Availability**
   - *Risk:* Insufficient benchmark data for meaningful comparisons
   - *Mitigation:* Create synthetic benchmarks if needed; design graceful fallbacks

---

## Daily Standup Questions
**Every morning at 9:00 AM:**

1. What did you complete yesterday?
2. What will you complete today?
3. Any blockers or dependencies?
4. Are you on track for your milestone?

---

## Definition of Done (Per Milestone)

### Each milestone is complete when:
- [ ] All deliverables are functionally implemented
- [ ] Code is committed and pushed to repository
- [ ] No critical bugs in completed features
- [ ] Success criteria are met and testable
- [ ] Handoff to next milestone is clean (no blocking issues)

### Final MVP is complete when:
- [ ] All 4 milestones are done
- [ ] Full demo runs smoothly start to finish
- [ ] Section 10 "Success Criteria" from PRD are all met
- [ ] Demo script is tested and timing is < 3 minutes
- [ ] Stakeholder validation achieved (positive reception)

---

## Team Roles & Responsibilities

### Full-Stack Developer (Primary)
- Implement all frontend components
- Build all backend API endpoints
- Integrate visualization libraries
- Handle data processing logic

### Data Scientist (Support)
- Provide CSV structure specification
- Supply sample datasets
- Define calculation formulas
- Review aggregation logic accuracy

### Product Owner (Oversight)
- Validate milestone completeness
- Approve scope trade-offs
- Test demo narrative flow
- Provide final acceptance

---

## Demo Preparation Checklist (Day 5)

### Pre-Demo Setup
- [ ] Demo dataset loaded and validated
- [ ] All filters tested with demo data
- [ ] Demo script written and rehearsed
- [ ] Backup plans for common failure scenarios
- [ ] Demo device/laptop configured and tested
- [ ] Offline mode working (if internet unreliable)

### Demo Script Outline
1. **Opening (30s):** Problem statement – AI adoption challenges
2. **Sentiment View (60s):** Upload data → Show heatmap → Filter by region → Explore resistance area
3. **Capability View (60s):** Switch to capability → View diamond → Drill into weak dimension → See constructs
4. **Action & ROI (45s):** Select intervention → View detailed recommendation → Show ROI glimpse
5. **Close (15s):** Export PDF → Show value proposition

**Total: ~3 minutes**

---

## Technical Stack Confirmation

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **UI Library:** React 18+
- **Visualization:** Recharts or D3.js (for radar/heatmap)
- **State Management:** Zustand or React Context
- **Styling:** Tailwind CSS
- **PDF Generation:** react-pdf or jsPDF

### Backend
- **API:** Next.js API Routes
- **Data Processing:** Node.js native + papaparse
- **AI Integration:** OpenAI API (GPT-4 for summarization)
- **Session Storage:** In-memory or temporary file system

### DevOps
- **Deployment:** Vercel (or similar)
- **Version Control:** Git + GitHub
- **Environment:** Node 18+

---

## Sprint Review Schedule

### End of Day 1 (Milestone 1)
- **Review Time:** 5:00 PM
- **Focus:** Data upload working? Types defined? Architecture solid?

### End of Day 2 (Milestone 2)
- **Review Time:** 5:00 PM
- **Focus:** Sentiment flow functional? Heatmap rendering correctly? Filters working?

### End of Day 3 (Milestone 3)
- **Review Time:** 5:00 PM
- **Focus:** Capability diamond complete? Benchmarks visible? AI summaries generating?

### End of Day 4 (Milestone 4 - Partial)
- **Review Time:** 5:00 PM
- **Focus:** Interventions working? ROI glimpse showing? PDF exporting?

### Day 5 Morning (Final Polish)
- **Review Time:** 11:00 AM
- **Focus:** Full demo run-through; identify any remaining issues

### Day 5 Afternoon (Final Acceptance)
- **Review Time:** 3:00 PM
- **Focus:** Stakeholder demo; gather feedback; sign-off

---

## Contingency Plan

### If Running Behind Schedule:
- **Priority 1 (Must Have):** Sentiment heatmap, Capability diamond (1-level only), Basic filtering, 2 interventions
- **Priority 2 (Should Have):** Construct drilldown, Benchmarks, ROI glimpse, PDF export
- **Priority 3 (Nice to Have):** AI summarization, Advanced polish, Min/max ranges

### Simplified Demo Path (If Needed):
1. Show pre-loaded data (skip upload)
2. Sentiment heatmap with 1 filter applied
3. One intervention recommendation
4. Simple ROI statement (no detailed view)
5. Skip PDF export, show screenshot instead

---

## Success Metrics

### Quantitative
- Demo completion time: < 3 minutes ✅
- Data upload to visualization: < 5 seconds ✅
- Filter application response: < 2 seconds ✅
- AI summary generation: < 10 seconds ✅
- Zero critical errors during demo ✅

### Qualitative
- Stakeholders understand product value ✅
- Demo feels intelligent and data-driven ✅
- Visuals are clear and executive-ready ✅
- Flow is logical and easy to follow ✅
- Product appears market-viable ✅

---

**Document Version:** 1.0  
**Last Updated:** October 22, 2025  
**Next Review:** End of Day 1 (October 22, 2025, 5:00 PM)


