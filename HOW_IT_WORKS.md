# 🧭 How AI Navigator Works

**A Complete Walkthrough of the Platform**

---

## Table of Contents

1. [Platform Overview](#platform-overview)
2. [Getting Started](#getting-started)
3. [Understanding the Data](#understanding-the-data)
4. [Using the Platform](#using-the-platform)
5. [Feature Walkthrough](#feature-walkthrough)
6. [AI Chat Assistant](#ai-chat-assistant)
7. [Technical Architecture](#technical-architecture)
8. [Common Workflows](#common-workflows)

---

## Platform Overview

### What is AI Navigator?

AI Navigator is an **assessment platform** that helps organizations understand their readiness for AI adoption by measuring two critical dimensions:

1. **Sentiment Analysis** - How people *feel* about AI
2. **Capability Maturity** - How *ready* the organization is

Think of it as a **diagnostic tool** that reveals both emotional blockers and capability gaps.

### The Core Problem It Solves

Organizations struggle with AI adoption because:
- They don't know **where resistance comes from** (sentiment blockers)
- They can't measure **capability maturity** across dimensions
- They lack **actionable insights** for improvement
- Existing tools are **complex** and require training

AI Navigator solves this with:
- ✅ **25-zone sentiment heatmap** - Visual resistance mapping
- ✅ **8-dimension capability diamond** - Maturity assessment across Strategy, Data, Technology, Talent, Organization, Innovation, Adoption, Ethics
- ✅ **AI chat interface** - Natural language interaction with your data
- ✅ **Spotlight interventions** - Curated, high-impact recommendations

---

## Getting Started

### Prerequisites

1. **Node.js 18+** installed
2. **Supabase account** (for database)
3. **OpenAI API key** (for AI chat)

### Setup (5 minutes)

```bash
# 1. Clone and install
git clone <repository-url>
cd ainavigator
npm install

# 2. Configure environment
cp .env.example .env.local

# Edit .env.local and add:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
OPENAI_API_KEY=your_openai_key

# 3. Import demo data
npm run import-demo-data

# 4. Start development server
npm run dev
```

### First Access

1. Open `http://localhost:3000`
2. You'll see the landing page
3. Click "**Get Started**" or navigate to `/dashboard`
4. The demo data is already loaded

---

## Understanding the Data

### Data Model

The platform uses **two primary data types**:

#### 1. Sentiment Responses

**Format**: 25 sentiment zones (5 levels × 5 categories)

**Sentiment Levels**:
- Level 1: Highly Negative
- Level 2: Negative
- Level 3: Neutral
- Level 4: Positive
- Level 5: Highly Positive

**Sentiment Categories** (Why people feel this way):
- Fear of job loss
- Lack of knowledge
- Ethical concerns
- Workload fears
- Data privacy concerns

**Example**: A response in **Zone 2-3** means "Negative sentiment due to ethical concerns"

#### 2. Capability Assessments

**Format**: 8 dimensions × 4 constructs each = 32 capability scores

**8 Dimensions**:
1. **Strategy & Vision** - AI strategy clarity
2. **Data** - Data quality and governance
3. **Technology** - Infrastructure readiness
4. **Talent & Skills** - Team capability
5. **Organisation & Processes** - Process maturity
6. **Innovation** - Innovation culture
7. **Adaptation & Adoption** - Change readiness
8. **Ethics & Responsibility** - Ethical frameworks

Each dimension has **4 constructs** scored 1-5.

**Example**:
- Strategy & Vision dimension might include constructs like "Clear AI vision", "Leadership alignment", "Resource allocation", "Success metrics"

### Data Storage

**Database**: Supabase PostgreSQL

**Key Tables**:
- `respondents` - Survey responses (sentiment + capability scores)
- `interventions` - Curated recommendations
- `benchmarks_sentiment` - Industry comparison data
- `benchmarks_capability` - Capability benchmarks

**Location**: `/supabase/migrations/` contains schema

**Data Files**: `/data/csv-imports/` contains import-ready CSV files

---

## Using the Platform

### Navigation Structure

```
Landing Page (/)
    ↓
Dashboard (/dashboard)
    ├── Sentiment View
    ├── Capability View
    └── Interventions View

Assessment Flow (/assessment)
    └── Guided capability assessment

Upload (/upload)
    └── Import new data

Demo Mode (/demo)
    └── Interactive walkthrough
```

### Primary Views

#### Dashboard (`/dashboard`)

**Purpose**: Main interface for exploring data

**Components**:
1. **Sentiment Heatmap** - 5×5 grid showing emotional readiness
2. **Capability Diamond** - 8-point radar chart showing maturity
3. **Filters** - Segment by region, department, age, business unit
4. **AI Chat** - Natural language querying (bottom-right button)

**How to Use**:
1. Load dashboard
2. Choose view: Sentiment or Capability
3. Apply filters if needed
4. Explore visualizations
5. Ask AI chat for insights

#### Sentiment View

**What You See**:
- 25-cell heatmap (5 levels × 5 categories)
- Color intensity = concentration of responses
- Green → Yellow → Red = severity

**How to Read It**:
- **Hot spots** (red zones) = areas of high resistance
- **Patterns** = systematic issues (e.g., entire "Fear of job loss" column is red)
- **Empty zones** = no responses in that sentiment/reason combination

**Example Insight**:
"High negative sentiment (red) in 'Fear of job loss' across all levels suggests widespread employment anxiety"

#### Capability View

**What You See**:
- 8-pointed diamond/radar chart
- Each point = one dimension (Strategy, Data, Technology, etc.)
- Distance from center = maturity level (1-5)

**How to Read It**:
- **Shape** tells the story:
  - Balanced shape = well-rounded maturity
  - Spiky shape = uneven capabilities
  - Small shape = low overall maturity
- **Specific gaps** = points close to center
- **Strengths** = points far from center

**Example Insight**:
"Strong in Technology (4.2) but weak in Talent & Skills (2.1) suggests infrastructure without human capability"

#### Interventions View

**What You See**:
- Curated recommendations ("spotlight interventions")
- Each intervention shows:
  - **Problem**: What it addresses
  - **Solution**: Recommended action
  - **Impact**: Expected improvement
  - **Effort**: Implementation difficulty

**How to Use**:
1. Review suggested interventions
2. Ask AI chat: "What interventions would work for Sales department?"
3. Filter interventions by capability dimension or sentiment area
4. Export recommendations to PDF

---

## Feature Walkthrough

### 1. Accessing Demo Mode

**Purpose**: Interactive walkthrough with sample data

**How to Access**:
```
Method 1: Direct URL
→ Navigate to http://localhost:3000/demo

Method 2: From Dashboard
→ Dashboard → Click "Demo Mode" in header (if available)

Method 3: From Landing Page
→ Landing page → "Try Demo" button
```

**What's Included**:
- Pre-loaded demo dataset
- Guided tooltips
- Example filters applied
- Sample AI chat queries

### 2. Uploading Your Data

**Purpose**: Import your own assessment data

**Steps**:
```
1. Go to /upload
2. Prepare CSV file following schema
   (see data/csv-imports/csv_schema_definition.md)
3. Drag-and-drop or click to upload
4. Validate data format
5. Confirm import
6. Data appears in dashboard
```

**CSV Requirements**:
- Columns must match schema exactly
- Sentiment columns: `Sentiment_1` through `Sentiment_25`
- Capability columns: Named per dimension/construct
- Metadata: `Region`, `Department`, `Age`, `BusinessUnit`

**Schema Reference**: `/data/csv-imports/csv_schema_definition.md`

### 3. Filtering Data

**Purpose**: Segment analysis by demographics

**Available Filters**:
- **Region**: EMEA, APAC, Americas, etc.
- **Department**: Sales, Engineering, Marketing, etc.
- **Age Group**: 18-25, 26-35, 36-45, 46-55, 56+
- **Business Unit**: Custom organizational units

**How to Apply**:
```
1. Dashboard → Filter panel (usually left sidebar or top bar)
2. Select filter criteria
3. Click "Apply Filters"
4. Visualizations update in real-time
5. AI chat context updates to filtered dataset
```

**Example Workflow**:
```
Question: "How does Sales department sentiment compare to Engineering?"

Steps:
1. Apply filter: Department = Sales
2. Note sentiment heatmap
3. Clear filter
4. Apply filter: Department = Engineering
5. Compare heatmaps
6. Or ask AI: "Compare Sales vs Engineering sentiment"
```

### 4. Using Benchmarks

**Purpose**: Compare your scores against industry standards

**Types of Benchmarks**:
1. **Industry benchmarks** - By sector (Tech, Finance, Healthcare, etc.)
2. **Regional benchmarks** - By geography (EMEA, APAC, Americas)
3. **Size benchmarks** - By company size (Startup, SMB, Enterprise)

**How to View**:
```
Dashboard → Benchmarks toggle (or dedicated Benchmarks view)
Your data appears alongside industry average
Gap analysis shows where you over/under-perform
```

**Example Insight**:
"Your Technology dimension (4.2) exceeds industry average (3.5) by 20%"

### 5. Exporting Reports

**Purpose**: Generate PDF summaries for stakeholders

**What's Included**:
- Executive summary
- Sentiment heatmap visualization
- Capability diamond chart
- Key insights and recommendations
- Spotlight interventions

**How to Export**:
```
1. Dashboard → Export button (usually top-right)
2. Select export format (PDF recommended)
3. Choose sections to include
4. Generate report
5. Download PDF
```

---

## AI Chat Assistant

### What It Does

The AI chat is powered by **GPT-4o** and can:
- ✅ **Execute actions** (navigate, filter, query data)
- ✅ **Analyze patterns** and correlations
- ✅ **Generate insights** from your data
- ✅ **Recommend interventions**
- ✅ **Create executive summaries**
- ✅ **Answer questions** in natural language

### How to Access

**Floating Button** (bottom-right corner):
- Teal/blue circular button with chat icon
- Available on every page
- Click to open chat sidebar

**Keyboard Shortcut**:
- Press `⌘K` (Mac) or `Ctrl+K` (Windows/Linux)

### Example Queries

**Navigation & Actions**:
```
"Show me Sales department sentiment"
→ AI applies Department filter and navigates to Sentiment view

"Generate a board-ready executive summary"
→ AI creates comprehensive summary with insights

"Filter data for EMEA region aged 26-35"
→ AI applies multiple filters simultaneously
```

**Analysis & Insights**:
```
"What are the biggest sentiment blockers?"
→ AI analyzes heatmap and identifies red zones

"Compare our Technology capability to industry average"
→ AI fetches benchmarks and provides comparison

"Which departments have the lowest AI readiness?"
→ AI ranks departments by combined sentiment + capability scores

"Show correlation between age and sentiment"
→ AI performs statistical analysis
```

**Recommendations**:
```
"What interventions would work for low Data maturity?"
→ AI suggests data governance, quality initiatives

"How can we improve Talent & Skills dimension?"
→ AI recommends training programs, hiring strategies

"What quick wins can we implement this quarter?"
→ AI prioritizes low-effort, high-impact interventions
```

### AI Chat Features

**Streaming Responses**:
- See answers as they're generated
- Real-time thinking visible

**Confidence Indicators**:
- AI shows confidence level (High/Medium/Low)
- Based on data availability and analysis complexity

**Proactive Suggestions**:
- After answering, AI suggests next questions
- Helps guide exploration

**Action Execution**:
- AI can navigate and filter automatically
- Confirms actions before executing

**Memory**:
- Remembers last 15 messages
- Maintains conversation context
- Builds on previous questions

---

## Technical Architecture

### System Overview

```
Frontend (Next.js 16)
    ↓
API Routes (Next.js API)
    ↓
Business Logic (lib/)
    ↓
Database (Supabase PostgreSQL)

AI Chat Flow:
User → Chat UI → GPT-4o → Action Execution → Data Update → UI Refresh
```

### Key Technologies

**Frontend**:
- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS
- Recharts (visualizations)

**Backend**:
- Next.js API Routes (serverless)
- Supabase (PostgreSQL + Auth)
- OpenAI GPT-4o (AI chat)

**State Management**:
- Zustand (global state)
- TanStack React Query (server state)

**Data Processing**:
- `lib/calculations/sentiment-ranking.ts` - Heatmap calculations
- `lib/calculations/capability-analysis.ts` - Diamond chart calculations

### Data Flow Diagram

```
1. USER ACTION
   ↓
2. UI COMPONENT (components/)
   ↓
3. STATE UPDATE (lib/store/)
   ↓
4. API CALL (app/api/)
   ↓
5. BUSINESS LOGIC (lib/services/, lib/calculations/)
   ↓
6. DATABASE QUERY (Supabase)
   ↓
7. DATA PROCESSING
   ↓
8. RESPONSE TO UI
   ↓
9. VISUALIZATION UPDATE
```

### AI Chat Architecture

```
User Message
    ↓
Chat UI (components/ai-agent/)
    ↓
Chat Service (lib/ai/chat-service.ts)
    ↓
GPT-4o API (OpenAI)
    ↓
Action Parser (lib/ai/chat-actions.ts)
    ↓
Action Execution (navigate/filter/query/generate)
    ↓
Data Fetcher (lib/ai/chat-data-fetcher.ts)
    ↓
Response Stream → UI Update
```

---

## Common Workflows

### Workflow 1: First-Time Analysis

**Goal**: Understand your organization's AI readiness

**Steps**:
1. ✅ Import your data (`/upload`)
2. ✅ Go to dashboard (`/dashboard`)
3. ✅ Review sentiment heatmap - identify red zones
4. ✅ Review capability diamond - identify weak dimensions
5. ✅ Ask AI: "What are my biggest gaps?"
6. ✅ Review recommended interventions
7. ✅ Export summary report for leadership

**Time**: ~15 minutes

### Workflow 2: Department Deep-Dive

**Goal**: Analyze specific department's readiness

**Steps**:
1. ✅ Dashboard → Apply filter: Department = [Target Department]
2. ✅ Review filtered sentiment heatmap
3. ✅ Review filtered capability scores
4. ✅ Ask AI: "Analyze [Department] AI readiness comprehensively"
5. ✅ Compare to other departments
6. ✅ Ask AI: "What interventions work for [Department]?"
7. ✅ Export department-specific report

**Time**: ~10 minutes per department

### Workflow 3: Quarterly Progress Tracking

**Goal**: Measure improvement over time

**Steps**:
1. ✅ Upload Q1 data
2. ✅ Note sentiment/capability baselines
3. ✅ Implement interventions
4. ✅ Upload Q2 data (3 months later)
5. ✅ Compare Q1 vs Q2:
   - Sentiment heatmap changes
   - Capability dimension improvements
6. ✅ Ask AI: "What improved and what didn't?"
7. ✅ Adjust intervention strategy

**Time**: Ongoing (quarterly reviews)

### Workflow 4: Executive Presentation

**Goal**: Present findings to leadership

**Steps**:
1. ✅ Dashboard → Review overall state
2. ✅ Ask AI: "Create board-ready executive summary"
3. ✅ Note key insights:
   - Biggest sentiment blockers
   - Critical capability gaps
   - Recommended interventions
   - Expected ROI
4. ✅ Export PDF report
5. ✅ Prepare talking points from AI summary
6. ✅ Present with confidence

**Time**: ~20 minutes preparation

### Workflow 5: Intervention Planning

**Goal**: Develop action plan to improve readiness

**Steps**:
1. ✅ Identify top 3 issues:
   - From sentiment heatmap (red zones)
   - From capability diamond (weak dimensions)
2. ✅ Ask AI: "What interventions address [Issue]?"
3. ✅ Review suggested interventions (spotlight view)
4. ✅ Prioritize by impact vs effort
5. ✅ Ask AI: "Create implementation timeline"
6. ✅ Assign owners and track progress

**Time**: ~30 minutes

---

## Troubleshooting

### Common Issues

**Issue**: Demo mode not loading
**Solution**: Check that demo data was imported via `npm run import-demo-data`

**Issue**: AI chat not responding
**Solution**: Verify `OPENAI_API_KEY` is set in `.env.local`

**Issue**: Visualizations show no data
**Solution**:
1. Check Supabase connection
2. Verify data was imported successfully
3. Check browser console for errors

**Issue**: Filters not working
**Solution**: Clear filters and reapply, or refresh the page

### Getting Help

1. Check documentation: `/docs/`
2. Review developer guide: `CLAUDE.md`
3. Check project structure: `/docs/PROJECT_STRUCTURE.md`
4. Review API logs in browser DevTools

---

## Next Steps

**For Users**:
1. Read this guide thoroughly
2. Try demo mode first
3. Import your data
4. Explore with AI chat
5. Share insights with team

**For Developers**:
1. Review `/CLAUDE.md` for technical details
2. Explore `/docs/PROJECT_STRUCTURE.md`
3. Check `/docs/team/DEVELOPER_GUIDE.md`
4. Review codebase in `/lib/` and `/components/`

**For Contributors**:
1. Read `/CONTRIBUTING.md`
2. Follow code standards in `/CLAUDE.md`
3. Test locally before submitting changes

---

## Summary

AI Navigator helps organizations:
- ✅ **Measure** AI readiness (sentiment + capability)
- ✅ **Visualize** gaps (heatmap + diamond)
- ✅ **Understand** blockers (AI-powered insights)
- ✅ **Act** decisively (curated interventions)

The platform combines:
- **Data-driven assessment** with **visual clarity**
- **AI-powered analysis** with **human intuition**
- **Strategic insights** with **tactical recommendations**

**Result**: Organizations move from uncertainty to confident AI adoption.

---

**Questions?** Ask the AI chat or check `/docs/` for more information.
