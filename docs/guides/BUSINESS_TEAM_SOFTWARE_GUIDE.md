# AI Navigator - Business Team Software Guide
**Functional Overview & Operating Instructions**

---

## 📋 Document Purpose

This guide explains how the AI Navigator software works, what it does, and how to operate it. This is a technical handover document for the business team to understand the delivered functionality.

---

## 🚀 Getting Started

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Login credentials (provided separately)

### Accessing the Application

**Local Development:**
```bash
cd /path/to/ainavigator
npm run dev
# Open http://localhost:3000
```

**Production URL:**
```
[To be provided based on deployment]
```

### Login
- Use provided credentials or demo access code
- Demo account: demo@leadingwithai.com

---

## 🏗️ What This Software Does

### Core Function
AI Navigator is an **assessment analysis platform** that:

1. **Ingests assessment data** - Reads employee survey responses (sentiment + capability scores)
2. **Calculates metrics** - Processes 25 sentiment zones and 8 capability dimensions
3. **Visualizes results** - Shows heatmaps, radar charts, and executive dashboards
4. **Identifies gaps** - Compares your data against industry benchmarks
5. **Recommends actions** - Suggests interventions based on identified gaps
6. **Exports reports** - Generates PDF summaries for stakeholders

### Data Flow
```
Employee Survey Data (CSV)
    ↓
Upload to Platform
    ↓
Automated Calculation Engine
    ↓
Interactive Visualizations
    ↓
AI Analysis & Recommendations
    ↓
Exportable Reports
```

---

## 📊 Understanding the Data Model

### Input Data Structure

The platform expects CSV files with:

**1. Sentiment Data (25 columns)**
- Measures how employees feel about AI
- Scale: 1-5 (1 = positive, 5 = negative - inverted for analysis)
- 5 concern levels × 5 sentiment categories = 25 zones

**2. Capability Data (32 columns)**
- Measures organizational readiness
- Scale: 1-7 (CMMI maturity scale)
- 8 dimensions × 4 constructs each = 32 scores

**3. Metadata Fields**
- Region (EMEA, APAC, Americas, etc.)
- Department (Finance, Sales, Engineering, etc.)
- Age Group (18-25, 26-35, 36-45, 46-55, 56+)
- Business Unit
- Tenure

### Calculation Logic

**Overall Readiness Score:**
```
Readiness = (Sentiment/4 × 40%) + (Capability/7 × 60%)
Result: Percentage 0-100%
```

**Sentiment Average:**
- Takes all 25 zone scores for filtered respondents
- Calculates mean
- Lower = better (concerns are low)

**Capability Average:**
- Takes all 32 construct scores for filtered respondents
- Groups by 8 dimensions (4 constructs per dimension)
- Calculates dimension average
- Overall average = mean of 8 dimensions
- Higher = better

**Benchmark Comparison:**
- Your score minus benchmark score = Gap
- Positive gap = above benchmark (good)
- Negative gap = below benchmark (needs work)

---

## 🎯 Platform Features - Section by Section

### 1. Executive Dashboard (Command Center)

**Location:** `/dashboard` or default landing page after login

**What It Shows:**

**Primary Metrics (Top Row):**
- **Overall Readiness**: Composite score combining sentiment + capability
  - Shows percentage (0-100%)
  - Progress bar with 70% goal marker
  - Status: Strong (75+), Moderate (60-74), Developing (<60)
  - Trend vs previous quarter

- **Employee Sentiment**: How people feel (1-5 scale, lower is better)
  - Average of all 25 sentiment zones
  - Benchmarks: vs All Companies, Industry, Region
  - Status indicator (Excellent/Moderate/Needs Attention)

- **Capability Maturity**: Organizational readiness (1-7 scale)
  - Average of 8 dimensions
  - CMMI maturity levels (1=Initial, 7=Optimizing)
  - Benchmarks: vs All Companies, Industry, Region

**AI Insight Cards (4 cards):**
1. **Strength** - What you're doing well
2. **Challenge** - Primary concern area
3. **Opportunity** - Where you can leverage existing strengths
4. **Recommended** - Suggested focus area

**Capability Dimensions Table:**
- Lists all 8 dimensions with scores
- Columns: Dimension name, Your score, Industry average, Gap, # of items, Performance status
- Color coded: EXCEEDS (green), MEETS (blue), BELOW (orange)
- Scrollable (shows 6-7 rows at once, 8 total)

**Navigation Buttons:**
- "Explore Sentiment Data" → Goes to detailed sentiment analysis
- "Analyze Capability Gaps" → Goes to detailed capability assessment

**How to Use:**
1. Review overall readiness percentage - is it above 60%?
2. Check sentiment and capability scores individually
3. Note benchmark comparisons - where do you exceed/lag?
4. Read the 4 AI insight cards - what are your priorities?
5. Scan the capability table - which dimensions need work?
6. Click navigation buttons to drill deeper

---

### 2. Sentiment Analysis

**Location:** `/dashboard` → Sentiment tab OR click "Explore Sentiment Data"

**What It Shows:**

**Sentiment Heatmap (5×5 Grid = 25 Zones):**

**Y-Axis (Rows) - Concern Levels:**
1. Personal Workflow Preferences
2. Collaboration & Role Adjustments
3. Professional Trust & Fairness
4. Career Security & Job Redefinition
5. Organizational Stability at Risk

**X-Axis (Columns) - Sentiment Categories:**
1. AI is too Autonomous
2. AI is too Inflexible
3. AI is Emotionless
4. AI is too Opaque (transparency issues)
5. People Prefer Human Interaction

**Color Coding:**
- Uses **relative ranking** within your dataset (not absolute scores)
- Dark Green (Top 3): Best sentiment zones
- Light Green (Top 8): Strong zones
- Yellow (Middle 9): Moderate zones
- Orange (Bottom 8): Concerning zones
- Red (Bottom 3): Critical issues

**Key Metrics Displayed:**
- Overall Sentiment Average
- Total Respondents
- Priority Concerns Count
- Filters Applied (if any)

**Interactive Elements:**

1. **Show Heatmap Guide** button
   - Explains the grid structure
   - Defines concern levels and categories
   - Clarifies color coding methodology

2. **Click Any Cell**
   - Opens modal with:
     - Zone title and description
     - Actual score (1-5 scale)
     - Number of respondents in this zone
     - Ranking (1-25, where 25 is worst)
     - Related interventions (if applicable)

3. **Filter Panel**
   - Region dropdown
   - Department dropdown
   - Age Group dropdown
   - Business Unit dropdown
   - Apply Filters button
   - **Effect:** Recalculates all scores based on filtered subset

4. **Generate AI Insights** button
   - Analyzes lowest-scoring cells
   - Identifies problem categories
   - Groups related concerns
   - Shows: Problem name, Severity, Affected count, Description

**How to Use:**
1. Look for red zones - these are your biggest problems
2. Click Show Heatmap Guide to understand structure
3. Click red cells to see details (score, count, ranking)
4. Note which column has most red - that's the primary concern type
5. Note which row has most red - that's the concern severity level
6. Use filters to analyze specific departments/regions
7. Click "Generate AI Insights" to get automated problem categorization

**Example Interpretation:**
- If Column 4 (AI too Opaque) is mostly red → Transparency problem
- If Row 5 (Organizational Stability) is mostly red → Deep systemic concerns
- Cell L5-C4 red with rank #25 → Most critical concern is organizational stability threatened by opaque AI

---

### 3. Capability Assessment

**Location:** `/dashboard` → Capability tab OR click "Analyze Capability Gaps"

**What It Shows:**

**8 Capability Dimensions:**
1. **Strategy & Vision** - Clear AI strategy and leadership alignment
2. **Data** - Data quality, governance, accessibility
3. **Technology** - Infrastructure, tools, platforms
4. **Talent & Skills** - AI literacy, expertise, training
5. **Organisation & Processes** - Operating model, workflows, governance
6. **Innovation** - Culture of experimentation, learning
7. **Adaptation & Adoption** - Change readiness, user acceptance
8. **Ethics & Responsibility** - Fairness, transparency, accountability

**Each Dimension Has 4 Constructs** (32 total):
- Specific capability statements
- Scored 1-7 on CMMI scale
- Dimension score = average of 4 constructs

**Radar Chart Views (3 tabs):**

**Tab 1: vs Benchmark (Default)**
- Teal filled polygon = Your scores
- Purple dashed polygon = Industry benchmark
- Shows where you exceed/lag industry standard

**Tab 2: Variance**
- Green dashed line = Maximum scores (best performers)
- Teal solid line = Average scores
- Red dashed line = Minimum scores (weakest performers)
- Wide spread = inconsistent capability across team

**Tab 3: Maturity**
- Teal filled = Current maturity
- Gray dashed = Full maturity (Level 7.0)
- Shows progress remaining to reach optimal state

**Benchmark Filter Options:**
1. **All Companies** - 150 companies across all industries/regions
2. **Industry Specific** - e.g., "Financial Services" (42 companies)
3. **Regional** - e.g., "North America" (68 companies)

**Dimensions Table:**
- All 8 dimensions listed
- Columns:
  - Dimension name
  - Your score (X.X/7.0)
  - Industry average
  - Gap (+/- X.X)
  - Number of constructs (always 4)
  - Performance status (EXCEEDS/MEETS/BELOW)
- Hover shows info icon
- Click dimension for construct-level detail (partial functionality)

**Key Statistics Shown:**
- Overall capability average
- Highest dimension (with score)
- Lowest dimension (with score)
- Gap analysis
- Number of dimensions above/below benchmark

**How to Use:**
1. Look at default "vs Benchmark" chart - which dimensions are inside purple line? (below benchmark)
2. Switch to "Variance" tab - which dimensions have wide spread? (inconsistent team)
3. Switch to "Maturity" tab - which have longest distance to edge? (furthest from maturity)
4. Change benchmark filter - compare to All vs Industry vs Region
5. Review table - focus on BELOW status dimensions with negative gaps
6. Click dimensions to see 4 underlying constructs (shows what specifically is weak)

**Example Interpretation:**
- Data dimension 4.1 vs benchmark 5.5 = -1.4 gap → Critical data infrastructure problem
- Innovation 5.1 vs benchmark 4.3 = +0.8 gap → Strength to leverage
- Wide variance in Talent dimension → Some people skilled, others not (training need)

---

### 4. Problem Categories (AI Analysis)

**Location:** Appears after clicking "Generate AI Insights" on Sentiment page

**What It Does:**
- Analyzes the 5 lowest-scoring sentiment cells
- Groups related concerns into thematic categories
- Identifies root causes
- Suggests intervention areas

**Output Format:**
Shows 3 Problem Categories, each with:
- **Category Name**: e.g., "The Opaque AI", "The Autonomous Threat"
- **Severity Level**: Critical, High, Medium, Low
- **Affected People**: Number of employees with this concern
- **Primary Concern**: What they're worried about
- **Secondary Themes**: Related issues
- **Suggested Actions**: What intervention types apply

**Example Output:**
```
Problem Category 1: The Opaque AI
- Severity: High
- Affected: 156 employees
- Primary: Transparency and explainability concerns
- Themes: Trust, accountability, black-box decisions
- Actions: AI Transparency Program, Explainability training
```

**How to Use:**
1. Read all 3 categories to understand problem themes
2. Note affected counts - prioritize high-impact areas
3. Review suggested actions - these feed into recommendations
4. Use this to explain WHY interventions are recommended

---

### 5. Interventions (Recommendations)

**Location:** `/dashboard` → Interventions tab OR sidebar "Recommendations"

**What It Shows:**
Curated list of recommended interventions matched to your gaps

**Current Implementation:**
- 5 prioritized interventions (A1-A3, B1-B4, C1-C2 from database)
- Matched to identified sentiment/capability gaps
- Each shows:
  - Intervention code (e.g., A1)
  - Name (e.g., "AI Roadmap Pressure Cooker")
  - Level (Strategy/Adoption/Innovation)
  - Core function (what it addresses)
  - Brief description
  - Timeline estimate
  - Effort level
  - Expected impact

**Intervention Details (Click to Expand):**
- Full description (2-3 paragraphs)
- Target outcomes
- Implementation approach
- Prerequisites
- Success metrics
- ROI estimates (directional)
- Related case studies (if available)

**ROI Estimates Shown:**
- Resistance reduction % (for sentiment-focused)
- Efficiency improvement % (for capability-focused)
- Timeline to value (weeks)
- Investment range ($K)
- Expected savings/value ($K)

**Example Interventions:**

**A1 - AI Roadmap Pressure Cooker**
- Level: Strategy & Vision
- Function: Rapid strategic alignment
- Timeline: 2 days intensive + 2 weeks follow-up
- Addresses: Strategy gaps, leadership alignment
- ROI: 40% faster strategy clarity

**B2 - AI Learning Week**
- Level: Adoption & Adoption
- Function: Rapid upskilling
- Timeline: 5 days intensive
- Addresses: Talent gaps, knowledge concerns
- ROI: 30% skill proficiency increase

**How to Use:**
1. Review the 5 recommendations
2. Note which gaps each intervention addresses (sentiment zones or capability dimensions)
3. Click to expand for full details
4. Prioritize by:
   - Severity of gap it addresses
   - ROI potential
   - Timeline fit (quick wins vs long-term)
   - Budget availability
5. Select interventions for action plan
6. Export recommendations in report

---

### 6. Reports & Export

**Location:** `/dashboard` → Reports tab OR sidebar "Reports & Export"

**What It Shows:**

**Report Formats Available:**

1. **Executive Summary Report** (Currently Functional)
   - Format: PDF, 25-30 pages
   - Includes:
     - Assessment overview
     - Sentiment heatmap visualization
     - Capability radar chart
     - Key metrics and benchmarks
     - Problem categories (AI insights)
     - Top 5 recommended interventions
     - ROI estimates
     - Next steps
   - Use case: Board presentations, stakeholder briefings

2. **Board Presentation Deck** (Coming Soon)
   - Format: PowerPoint, 12-15 slides
   - Condensed executive version

3. **Detailed Analytics Report** (Coming Soon)
   - Format: PDF, 40-50 pages
   - Full statistical analysis

4. **Raw Data Export** (Coming Soon)
   - Format: CSV
   - Complete dataset with calculations

**Export Actions:**
- "Quick Export PDF" button - generates executive summary immediately
- Individual report cards show "Generate & Download" buttons
- Share options (email, link, schedule) - coming soon

**How to Use:**
1. Navigate to Reports page
2. Click "Quick Export PDF" or "Generate & Download" on Executive Summary card
3. Wait for generation (may take 10-30 seconds)
4. PDF downloads automatically
5. Review PDF before sharing with stakeholders
6. Use for board meetings, executive reviews, team discussions

**Note:** PDF export functionality depends on backend configuration. If it fails, check server logs or API configuration.

---

## 🔧 Technical Features

### Real-Time Filtering

**How It Works:**
1. User selects filter criteria (region, department, age, etc.)
2. System recalculates ALL metrics using only filtered respondents:
   - Sentiment zone averages
   - Capability dimension averages
   - Overall readiness score
   - Benchmark comparisons
   - AI insights
3. All visualizations update immediately
4. No page refresh required

**What Gets Filtered:**
- Sentiment heatmap cells
- Capability radar chart
- Overall readiness score
- Benchmark comparisons
- AI-generated insights
- Intervention priorities

**Calculation Method:**
```javascript
// Pseudocode
filteredData = allRespondents.filter(r => 
  r.region === selectedRegion && 
  r.department === selectedDepartment
)

sentimentAverage = calculateAverage(filteredData.sentimentScores)
capabilityAverage = calculateAverage(filteredData.capabilityScores)
// ... update all displays
```

### Benchmark Comparisons

**Three Benchmark Types:**

1. **All Companies**
   - 150 companies globally
   - Mix of industries, sizes, regions
   - Baseline comparison

2. **Industry-Specific**
   - e.g., Financial Services: 42 companies
   - Same sector peers
   - More relevant for strategic decisions

3. **Regional**
   - e.g., North America: 68 companies
   - Geographic peers
   - Accounts for regional differences

**How Benchmarks Work:**
```
Your Score: 4.1
Benchmark: 5.5
Gap: 4.1 - 5.5 = -1.4 (you're below)

Display:
- Table shows: -1.4 in red with down arrow
- Chart shows: your polygon inside benchmark polygon
- Status: BELOW BENCHMARK
```

**Benchmark Data Source:**
- Stored in database table: `benchmarks_capability`
- Industry and region codes match assessment metadata
- Pre-calculated averages from anonymized client data

### Relative Ranking (Sentiment Heatmap)

**Why Relative, Not Absolute?**
- Problem: Absolute scores can be misleading (all scores might be close)
- Solution: Rank cells 1-25 within YOUR dataset
- Effect: Colors show RELATIVE priorities specific to your organization

**How It Works:**
1. Calculate average score for each of 25 cells
2. Rank cells from best (1) to worst (25)
3. Assign colors based on rank:
   - Ranks 1-3: Dark green
   - Ranks 4-8: Light green
   - Ranks 9-17: Yellow
   - Ranks 18-22: Orange
   - Ranks 23-25: Red

**Example:**
```
Cell A: Score 2.8, Rank 23 → RED (even though 2.8 isn't terrible)
Cell B: Score 2.6, Rank 15 → YELLOW (better relative to your dataset)
```

**Why This Matters:**
- Helps prioritize within YOUR context
- Avoids false alarms from absolute thresholds
- Focuses attention on worst areas relative to your organization

### AI Insights Generation

**What Happens When You Click "Generate AI Insights":**

1. **Data Selection**
   - System identifies 5 lowest-ranked sentiment cells
   - Extracts associated respondent data
   - Includes open-ended text responses (if available)

2. **Analysis Process**
   - Groups cells by sentiment category (C1-C5) and level (L1-L5)
   - Identifies patterns (e.g., multiple cells in "AI too Opaque" column)
   - Counts affected respondents
   - Determines severity based on concern level

3. **Output Generation**
   - Creates 3 problem categories
   - Names them descriptively (e.g., "The Opaque AI")
   - Assigns severity level
   - Lists primary and secondary themes
   - Suggests relevant interventions

**Current Implementation:**
- Mock analysis (pre-defined responses based on common patterns)
- Real GPT integration can be added via OpenAI API
- Results shown after 1.5 second loading animation

---

## 🎮 User Interactions

### Navigation Methods

**Sidebar Menu:**
- Dashboard / Overview
- Sentiment Analysis
- Capability Assessment
- Interventions
- Reports & Export

**Keyboard Shortcuts:**
- `1` - Jump to Dashboard
- `2` - Jump to Sentiment
- `3` - Jump to Capability
- `4` - Jump to Interventions
- `5` - Jump to Reports
- `←` / `→` - Previous/Next section
- `F` - Toggle filters
- `ESC` - Close modals

**In-Page Navigation:**
- Click cells/dimensions for details
- Tab between chart views
- Click benchmark filters
- Expand/collapse sections
- Apply/clear filters

### Interactive Elements

**Dashboard:**
- Click "Explore Sentiment Data" button
- Click "Analyze Capability Gaps" button
- Hover over dimension table rows

**Sentiment Page:**
- Click "Show Heatmap Guide" toggle
- Click any of 25 heatmap cells
- Click "Generate AI Insights" button
- Apply filters via dropdown + button
- Close modal with X or ESC

**Capability Page:**
- Click chart view tabs (vs Benchmark, Variance, Maturity)
- Click benchmark filter buttons (All, Industry, Region)
- Hover over radar chart dimensions
- Click dimension rows in table
- Apply filters

**Interventions Page:**
- Click intervention cards to expand
- Scroll through 5 recommendations
- Click "Select for Action Plan" (prepares for export)
- Click "View Case Studies" (if available)

**Reports Page:**
- Click "Quick Export PDF" button
- Click "Generate & Download" on specific report cards

---

## 📈 Business Workflows

### Workflow 1: Initial Assessment Review (First-Time User)

**Time: 15 minutes**

1. **Login** → Land on Dashboard
2. **Review overall readiness** - Is it above 60%?
3. **Check sentiment score** - Are employees resistant?
4. **Check capability score** - Is organization ready?
5. **Read 4 AI insight cards** - What are priorities?
6. **Scan capability table** - Which dimensions are below benchmark?
7. **Click "Explore Sentiment Data"**
8. **Review heatmap** - Where are the red zones?
9. **Click worst cell** - What's the specific concern?
10. **Generate AI insights** - What are problem themes?
11. **Navigate to Capability**
12. **Review radar chart** - Which dimensions lag?
13. **Switch chart views** - Is team consistent? How far to maturity?
14. **Navigate to Interventions**
15. **Review top 3 recommendations** - What actions address top gaps?
16. **Navigate to Reports**
17. **Export PDF** for stakeholders

**Outcome:** Complete understanding of organizational AI readiness

---

### Workflow 2: Department-Specific Analysis

**Time: 10 minutes per department**

**Use Case:** HR wants to understand Finance department sentiment

1. **Navigate to Sentiment page**
2. **Open filter panel**
3. **Select Department: Finance**
4. **Click "Apply Filters"**
5. **Heatmap recalculates** - showing only Finance respondents
6. **Note which zones are red** - Finance-specific problems
7. **Click worst cell** - see Finance-specific score and count
8. **Generate AI insights** - Finance-specific problem categories
9. **Navigate to Capability page** (filters persist)
10. **Review Finance capability scores** vs overall company
11. **Compare to Finance-specific benchmarks** (if available)
12. **Navigate to Interventions**
13. **Identify interventions relevant to Finance**
14. **Export filtered report** specifically for Finance leadership

**Outcome:** Targeted action plan for Finance department

---

### Workflow 3: Quarterly Progress Tracking

**Time: 20 minutes**

**Use Case:** Measuring improvement after implementing interventions

1. **Upload new quarter data** (Q2)
2. **Compare Q2 vs Q1 metrics:**
   - Overall readiness: 46% → ?
   - Sentiment: 1.3 → ?
   - Capability: 4.1 → ?
3. **Sentiment page:** Which zones improved? (green cells increased?)
4. **Capability page:** Which dimensions improved? (gaps reduced?)
5. **Identify:** What worked? (areas where interventions were implemented)
6. **Identify:** What didn't? (persistent red zones or gaps)
7. **Adjust strategy:** Reprioritize interventions based on Q2 results
8. **Export comparative report** showing Q1 vs Q2 progress

**Outcome:** Data-driven decisions on continuing/adjusting interventions

---

### Workflow 4: Executive Presentation Prep

**Time: 30 minutes**

**Use Case:** Preparing for board meeting on AI readiness

1. **Dashboard:** Screenshot overall readiness score
2. **Dashboard:** Note key metrics (sentiment, capability, benchmarks)
3. **Dashboard:** Copy 4 AI insight cards text
4. **Sentiment page:** Screenshot heatmap
5. **Sentiment page:** Note worst 3 cells with scores
6. **Generate AI insights:** Screenshot problem categories
7. **Capability page:** Screenshot radar chart (vs Benchmark view)
8. **Capability page:** Screenshot dimensions table
9. **Capability page:** Note 3 weakest dimensions with gaps
10. **Interventions page:** Screenshot top 3 recommendations
11. **Interventions page:** Note ROI estimates
12. **Reports page:** Export full PDF
13. **Prepare talking points:**
    - "Our readiness is X%"
    - "Primary challenge: [problem category]"
    - "Top 3 gaps: [dimensions]"
    - "Recommended actions: [interventions]"
    - "Expected ROI: [estimates]"

**Outcome:** Confident, data-backed executive presentation

---

## 🐛 Troubleshooting

### Data Not Loading

**Symptoms:**
- Empty heatmap
- Zero respondents shown
- No data message

**Possible Causes:**
1. No data uploaded
2. Filters too restrictive (no respondents match)
3. Database connection issue
4. Authentication problem

**Solutions:**
1. Check if demo data is loaded: `npm run import-demo-data`
2. Clear all filters - click "Clear Filters" or reset
3. Check browser console for errors (F12 → Console tab)
4. Verify Supabase connection in `.env.local`
5. Check network tab for API failures

### Filters Not Working

**Symptoms:**
- Selecting filter doesn't change visualizations
- "Apply Filters" button not responding
- Filter selections don't persist

**Solutions:**
1. Ensure you clicked "Apply Filters" button (not just selecting)
2. Check if filtered subset has respondents (might be zero)
3. Try clearing filters and reapplying
4. Refresh page
5. Check browser console for JavaScript errors

### PDF Export Failing

**Symptoms:**
- "Generate PDF" button doesn't work
- Download never starts
- Error message appears

**Solutions:**
1. Check if backend PDF service is running
2. Verify API endpoint configuration
3. Check browser's download permissions
4. Try different browser
5. Check server logs for PDF generation errors
6. Ensure all required data is present (charts, metrics)

### Charts Not Rendering

**Symptoms:**
- Blank radar chart
- Heatmap cells not showing
- Visualization containers empty

**Solutions:**
1. Check if data loaded successfully
2. Verify chart library (Recharts) loaded properly
3. Check browser console for rendering errors
4. Try refreshing page
5. Ensure responsive container has dimensions
6. Check if filters returned empty dataset

### AI Insights Not Generating

**Symptoms:**
- "Generate AI Insights" button does nothing
- Loading never completes
- Error appears

**Solutions:**
1. Currently uses mock data - check if mock service is configured
2. For real GPT: Verify OpenAI API key in `.env.local`
3. Check network request in browser tools
4. Verify API endpoint is accessible
5. Check server logs for API errors
6. Ensure lowest-scoring cells have data

### Slow Performance

**Symptoms:**
- Filtering takes long time
- Page transitions sluggish
- Visualizations lag

**Solutions:**
1. Check dataset size (very large datasets may be slow)
2. Close other browser tabs
3. Check browser memory usage
4. Verify no infinite loops in console
5. Consider pagination for large datasets
6. Optimize calculation functions if needed

---

## 🔐 Data & Security Notes

### Data Privacy

**What Data Is Stored:**
- Assessment responses (sentiment + capability scores)
- Metadata (region, department, age - anonymized)
- Calculated metrics
- Benchmark comparisons

**What Is NOT Stored:**
- Individual employee names
- Email addresses (unless used for login)
- Personal identifiable information

**Data Handling:**
- All responses anonymized
- Aggregated for analysis
- No individual tracking
- Export PDFs contain only aggregated data

### User Access Levels

**Current Implementation:**
- Demo mode: Full access to demo dataset
- Single-user mode: One organization per deployment

**Future Implementation:**
- Multi-tenant: Organization-specific data isolation
- RBAC: Admin, Analyst, Viewer roles
- SSO: Enterprise authentication

---

## 📊 Data Requirements for Upload

### CSV Format Required

**File Structure:**
- One row per respondent
- Headers must match schema exactly
- No missing required columns

**Required Columns:**

**Sentiment Columns (25):**
```
L1C1_Score, L1C2_Score, ..., L5C5_Score
```
- Values: 1-5 (integer or decimal)
- 1 = highly positive, 5 = highly negative

**Capability Columns (32):**
```
D1C1_Score, D1C2_Score, D1C3_Score, D1C4_Score,
D2C1_Score, ..., D8C4_Score
```
- Values: 1-7 (integer or decimal)
- CMMI scale (1 = Initial, 7 = Optimizing)

**Metadata Columns:**
```
Region, Department, AgeGroup, BusinessUnit, Tenure
```
- Text values
- Standardize values for filtering to work

**Optional Columns:**
```
OpenEndedResponse_1, OpenEndedResponse_2, ...
```
- Text responses for qualitative analysis

### Sample Data Format

```csv
RespondentID,Region,Department,AgeGroup,L1C1_Score,L1C2_Score,...,D1C1_Score,D1C2_Score,...
1,EMEA,Finance,26-35,2.5,3.1,...,4.2,5.1,...
2,Americas,Sales,36-45,1.8,2.2,...,3.9,4.6,...
```

### Data Validation

**System Checks:**
- All required columns present
- Score values within valid ranges
- Minimum respondent count (recommend 30+)
- No completely empty columns

**If Validation Fails:**
- Error message shows which column(s) problematic
- Upload rejected - must fix CSV and retry
- Download error log with details

---

## 🚦 System Status Indicators

### Health Checks

**Green Indicators (System OK):**
- Data loaded successfully
- All calculations complete
- Visualizations rendering
- Filters working
- Export functional

**Yellow Indicators (Warnings):**
- Small sample size (<30 respondents)
- Some benchmark data missing
- Optional features unavailable
- Performance slower than expected

**Red Indicators (Errors):**
- No data loaded
- Calculation failures
- API errors
- Database connection lost
- Export not working

### Where to Check Status

1. **Browser Console** (F12 → Console)
   - JavaScript errors
   - API call failures
   - Calculation logs

2. **Network Tab** (F12 → Network)
   - API response codes
   - Data transfer sizes
   - Request timing

3. **Application Logs** (Server-side)
   - Backend processing errors
   - Database query issues
   - PDF generation failures

---

## 📞 Support & Resources

### Documentation Files

- **README.md** - Project overview and setup
- **HOW_IT_WORKS.md** - Technical architecture explanation
- **CLAUDE.md** - Developer guide with code standards
- **docs/PROJECT_STRUCTURE.md** - Codebase organization
- **data/csv-imports/csv_schema_definition.md** - Data format specification

### Key Code Locations

**Calculations:**
- `lib/calculations/sentiment-ranking.ts` - Heatmap logic
- `lib/calculations/capability-analysis.ts` - Capability scoring

**Components:**
- `components/dashboard/ExecutiveDashboard.tsx` - Command center
- `components/sentiment/SentimentHeatmapRevised.tsx` - Heatmap
- `components/capability/CapabilityOverview.tsx` - Radar chart
- `components/interventions/InterventionsBrowsePage.tsx` - Recommendations

**API Endpoints:**
- `app/api/data/route.ts` - Data operations
- `app/api/interventions/route.ts` - Intervention matching
- `app/api/gpt/route.ts` - AI insights generation

### Getting Help

**For Technical Issues:**
1. Check browser console for errors
2. Review documentation files
3. Check GitHub issues (if applicable)
4. Contact dev team with:
   - Error message
   - Steps to reproduce
   - Browser/environment details
   - Screenshots

**For Business Questions:**
1. Review business playbook (provided separately)
2. Check intervention documentation
3. Review ROI methodology
4. Contact product/business owner

---

## ✅ Pre-Demo Checklist

### Before Showing to Stakeholders

**Technical Verification:**
- [ ] Application running without errors
- [ ] Demo data loaded (1000 respondents)
- [ ] All pages accessible
- [ ] Filters working
- [ ] Charts rendering
- [ ] PDF export functional (or prepared backup)
- [ ] Keyboard shortcuts working
- [ ] No console errors

**Data Verification:**
- [ ] Overall readiness calculates correctly
- [ ] Sentiment heatmap shows colored zones
- [ ] Capability radar chart displays
- [ ] Benchmarks populated
- [ ] AI insights generate (or mock works)
- [ ] Interventions list populated
- [ ] All metrics make logical sense

**Presentation Preparation:**
- [ ] Browser bookmarked to login page
- [ ] Demo credentials saved
- [ ] Screen resolution appropriate
- [ ] Browser zoom at 100%
- [ ] No distracting bookmarks/extensions
- [ ] Backup screenshots ready
- [ ] Sample PDF report available
- [ ] Talking points prepared

---

## 🎯 Key Messages for Stakeholders

### What This Software Delivers

1. **Automated Analysis**
   - Replaces manual spreadsheet work
   - Calculates 33 metrics automatically (25 sentiment + 8 capability)
   - Updates in real-time with filtering

2. **Visual Communication**
   - Executive-friendly dashboards
   - Heatmaps show problems at a glance
   - Radar charts show capability gaps
   - No technical knowledge required to interpret

3. **Actionable Intelligence**
   - Not just data - identifies specific problems
   - Recommends concrete interventions
   - Estimates ROI for each action
   - Prioritizes by impact and effort

4. **Stakeholder-Ready Output**
   - Professional PDF reports
   - Board presentation format
   - Shareable insights
   - Benchmark comparisons add credibility

### What Makes This Different

**vs Manual Analysis:**
- 15 minutes vs 8 hours to generate insights
- Real-time updates vs static reports
- Interactive exploration vs fixed views

**vs Survey Tools:**
- Analysis + recommendations, not just data collection
- Dual framework (sentiment + capability)
- Benchmark comparisons built-in

**vs Consulting:**
- Self-service insights vs waiting for consultant
- Consistent methodology vs subjective opinions
- Repeatable quarterly vs one-time assessment

---

## 📋 Summary

This software enables organizations to:

1. ✅ **Assess** AI readiness through 25 sentiment zones + 8 capability dimensions
2. ✅ **Visualize** results through heatmaps, radar charts, and executive dashboards
3. ✅ **Compare** against 150+ industry benchmarks
4. ✅ **Identify** specific problem areas and gaps
5. ✅ **Recommend** concrete interventions with ROI estimates
6. ✅ **Report** findings in professional, shareable formats

**Technical Status:** Functional MVP with core features operational

**Known Limitations:**
- PDF export depends on backend configuration
- AI insights currently use mock data (GPT integration ready)
- Some drilldown features partial (construct-level details)
- Multi-tenant features not yet implemented

**Ready For:** Internal use, pilot clients, stakeholder demos

---

**Questions?** Reference the technical documentation or contact the development team.

