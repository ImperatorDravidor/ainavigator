# AI Navigator - Software Demonstration Script
**Step-by-Step Functional Demo for Business Team**

---

## 🎯 Purpose

This is a **functional software demonstration** showing what the application does, how to use it, and what outputs it produces. This is NOT a marketing pitch - it's a technical handover to the business team.

**Duration:** 10-12 minutes for complete walkthrough

---

## 🚀 Pre-Demo Setup

### Before Starting

1. **Start the application:**
   ```bash
   cd /path/to/ainavigator
   npm run dev
   ```
   Or navigate to production URL

2. **Login:**
   - Use demo credentials
   - Verify you land on dashboard

3. **Confirm data loaded:**
   - Should see "1000 employees" or similar
   - Charts should be visible
   - No error messages

4. **Browser setup:**
   - Full screen (F11) or maximized window
   - Zoom at 100%
   - Close unnecessary tabs

---

## 📋 Demo Script

### [0:00 - 1:00] Introduction & Dashboard Overview

**SCREEN:** Dashboard / Command Center

**SAY:**
> "This is AI Navigator - our assessment analysis platform. It processes employee survey data and calculates readiness metrics across two dimensions: how people feel about AI (sentiment), and how prepared the organization is (capability)."

**POINT TO:**
- Top of page: "Based on 1000 employees"

**SAY:**
> "For this demo, we're using a dataset of 1000 employee responses from a financial services company."

**POINT TO:** The three main metric cards

**SAY:**
> "The system calculates three primary scores automatically:
> 
> 1. **Overall Readiness: 46%** - This combines sentiment and capability into a single metric. The formula weights sentiment at 40% and capability at 60%. You can see we're below the target of 70%.
> 
> 2. **Employee Sentiment: 1.3 out of 4** - This averages 25 different sentiment measurements. Lower scores indicate more concerns. This organization's employees are showing resistance.
> 
> 3. **Capability Maturity: 4.1 out of 7** - This averages 8 organizational capability dimensions on a CMMI scale. Level 4 is intermediate maturity."

**POINT TO:** Benchmark comparisons underneath each score

**SAY:**
> "Each metric compares against three benchmarks: all companies, your specific industry, and your region. Notice sentiment is -0.2 below industry average but +0.3 above all companies globally."

**POINT TO:** The 4 AI insight cards

**SAY:**
> "The system analyzes the data and generates these insight cards:
> - Strength: What you're doing well
> - Challenge: Primary concern area  
> - Opportunity: Where to leverage existing capabilities
> - Recommended: Suggested focus area
> 
> These are calculated based on pattern analysis of the scores."

**SCROLL DOWN** to capability dimensions table

**SAY:**
> "This table shows all 8 capability dimensions with your scores versus industry benchmarks. You can see Data Infrastructure at 4.1 versus benchmark 5.5 is our biggest gap at -1.4 points."

**PAUSE for questions**

---

### [1:00 - 4:00] Sentiment Analysis Deep Dive

**CLICK:** "Explore Sentiment Data" button

**SAY:**
> "Let me show you the sentiment analysis module. This is where the platform visualizes all 25 sentiment measurements."

**SCREEN:** Sentiment Heatmap page loads

**POINT TO:** The 5x5 grid

**SAY:**
> "This heatmap represents 25 different sentiment zones. The structure is:
> - 5 rows representing concern severity levels - from personal workflow concerns at the top to organizational stability concerns at the bottom
> - 5 columns representing why people have concerns - autonomous AI, inflexible AI, emotionless AI, opaque AI, or preference for humans"

**CLICK:** "Show Heatmap Guide" button

**SAY:**
> "Let me expand the guide so you can see the full structure."

**GUIDE EXPANDS**

**READ aloud** the Y-axis labels (just first and last):
> "Level 1 at top: Personal Workflow Preferences - minor concerns
> 
> Level 5 at bottom: Organizational Stability at Risk - serious concerns"

**READ aloud** the X-axis labels (pick 2-3):
> "Column 4 is 'AI is too Opaque' - transparency and explainability concerns
> 
> Column 1 is 'AI too Autonomous' - loss of control concerns"

**POINT TO:** Color legend

**SAY:**
> "Important: These colors show relative ranking within YOUR organization, not absolute scores. 
> - Red = your bottom 3 zones (worst areas)
> - Orange = bottom 8
> - Yellow = middle 9  
> - Green = top areas
> 
> This helps you prioritize what to fix first relative to your own data, not against arbitrary thresholds."

**CLICK:** A RED cell (e.g., Level 5, Column 4)

**MODAL OPENS**

**SAY:**
> "When you click any cell, it shows:
> - The actual score: 2.42 out of 4
> - How many employees responded in this zone: 134 people  
> - Ranking: This is #25 out of 25 - your worst zone
> - A description of what this concern means
> 
> So 134 employees have serious organizational-level concerns about AI transparency. That's a systemic trust issue."

**CLOSE MODAL** (X button or ESC)

**CLICK:** Filter icon/button

**SAY:**
> "You can filter by department, region, age, business unit, or tenure to drill into specific segments."

**SELECT:** A department (e.g., Finance)

**CLICK:** "Apply Filters"

**HEATMAP UPDATES**

**SAY:**
> "Notice the heatmap recalculates immediately. All scores, rankings, and colors update based only on Finance department respondents. Every visualization in the platform respects these filters."

**CLICK:** "Clear Filters" or reset

**CLICK:** "Generate AI Insights" button

**LOADING ANIMATION** (1.5 seconds)

**SAY:**
> "The AI analysis feature identifies the worst-performing cells and groups them into problem categories."

**RESULTS APPEAR** - 3 Problem Categories

**SAY:**
> "The system has identified three problem themes:
> 
> **Problem 1: The Opaque AI** - High severity, affecting 156 employees. Primary concern is transparency - people don't understand how AI makes decisions.
> 
> **Problem 2: The Autonomous Threat** - Critical severity, 134 people. Concerns about AI acting without human oversight and potential job displacement.
> 
> **Problem 3: The Inflexible System** - Medium severity, 98 people. AI can't handle exceptions or adapt to context.
> 
> These categorizations feed directly into the intervention recommendations."

**PAUSE for questions**

---

### [4:00 - 7:00] Capability Assessment Deep Dive

**CLICK:** "Capability" in sidebar navigation (or back to dashboard → "Analyze Capability Gaps")

**SAY:**
> "Now let's look at capability assessment - measuring organizational readiness across 8 dimensions."

**SCREEN:** Capability page loads with radar chart

**POINT TO:** The radar chart (default view: vs Benchmark)

**SAY:**
> "This radar chart shows 8 capability dimensions:
> 1. Strategy & Vision
> 2. Data  
> 3. Technology
> 4. Talent & Skills
> 5. Organisation & Processes
> 6. Innovation
> 7. Adaptation & Adoption
> 8. Ethics & Responsibility
> 
> Each dimension is scored 1-7 on a CMMI maturity scale. The teal filled area is your organization. The purple dashed line is your industry benchmark."

**POINT TO:** Where teal is inside purple (gaps)

**SAY:**
> "You can see Data and Technology dimensions are significantly below the benchmark - your organization lags in infrastructure readiness."

**CLICK:** "Variance" tab

**CHART UPDATES** to show Max/Avg/Min

**SAY:**
> "This variance view shows consistency across your team:
> - Green dashed = highest scores (your best performers)
> - Teal solid = average
> - Red dashed = lowest scores (your weakest performers)
> 
> Wide spread means inconsistent capability - some people are advanced, others are beginners. Narrow spread means aligned capability."

**POINT TO:** Dimensions with wide spread

**SAY:**
> "Talent & Skills shows wide variance - you have pockets of expertise but it's not distributed evenly."

**CLICK:** "Maturity" tab

**CHART UPDATES** to show current vs. full maturity

**SAY:**
> "This maturity view shows how far you have to go to reach Level 7 - optimal maturity. The gray dashed line is the target. You can see Data Infrastructure has the longest runway to full maturity."

**CLICK:** Back to "vs Benchmark" tab

**CLICK:** "Financial Services" benchmark filter button

**SAY:**
> "You can compare against different peer groups. Right now we're comparing to 42 companies in Financial Services specifically."

**CHART UPDATES** - benchmark line shifts

**SAY:**
> "Notice the benchmark line moved - you're slightly worse compared to direct industry peers than you were against all companies."

**CLICK:** "North America" benchmark filter

**SAY:**
> "And here's the regional comparison - 68 companies in North America."

**SCROLL DOWN** to the dimensions table

**SAY:**
> "The table gives you exact numbers:
> - Your score / 7.0
> - Industry average
> - Gap (positive or negative)
> - Number of underlying items measured (always 4 constructs per dimension)
> - Performance status
> 
> Data Infrastructure: 4.1 vs benchmark 5.5 = -1.4 gap = BELOW status
> Innovation: 5.1 vs 4.3 = +0.8 gap = EXCEEDS status"

**HOVER** over a row (shows info icon)

**SAY:**
> "You can click rows to see the 4 constructs that make up each dimension, though that's still being refined."

**PAUSE for questions**

---

### [7:00 - 9:30] Interventions & Recommendations

**CLICK:** "Interventions" or "Recommendations" in sidebar

**SAY:**
> "Based on the gaps identified, the system recommends specific interventions."

**SCREEN:** Interventions page loads

**SAY:**
> "The platform has matched 5 interventions to your specific gaps. These are pulled from our intervention library and prioritized by relevance."

**SCROLL** through the 5 interventions

**SAY:**
> "Each intervention shows:
> - Name and code
> - What level it operates at (Strategy, Adoption, Innovation)
> - What it addresses
> - Brief description
> - Estimated timeline
> - Effort level
> - Expected impact"

**CLICK:** First intervention to expand

**FULL DETAILS APPEAR**

**SAY:**
> "Let's look at the top recommendation: **AI Transparency & Explainability Program**
> 
> **What it addresses:** The 'Opaque AI' problem category we saw - 156 employees concerned about transparency
> 
> **Timeline:** 12 weeks
> 
> **Investment:** $150K-$350K depending on scope
> 
> **ROI Estimate:** 30-50% reduction in resistance, 40% increase in adoption, reduced compliance risk
> 
> **Outcomes:** 
> - Explainable AI framework
> - Transparency documentation
> - User-facing explanations
> - Audit trails
> 
> The ROI estimates are directional based on industry benchmarks from similar implementations."

**SCROLL** to see full description

**CLICK:** Collapse or back

**SAY:**
> "Each of these 5 interventions is linked to either a sentiment problem category or a capability gap. The system does this matching automatically based on what each intervention is designed to address."

**POINT TO:** The other 4 interventions

**SAY:**
> "For example:
> - Intervention 2 addresses Data Infrastructure gap (-1.4)
> - Intervention 3 addresses 'Autonomous Threat' concern
> - Intervention 4 addresses Talent & Skills gap
> - Intervention 5 addresses organizational stability concerns"

**PAUSE for questions**

---

### [9:30 - 11:00] Reports & Export

**CLICK:** "Reports" or "Reports & Export" in sidebar

**SAY:**
> "Finally, the reporting module packages everything into shareable formats."

**SCREEN:** Reports page loads

**POINT TO:** Report format options

**SAY:**
> "Four report types are planned:
> 
> 1. **Executive Summary** - 25-30 page PDF with all findings - THIS ONE IS FUNCTIONAL
> 2. Board Presentation Deck - PowerPoint slides - Coming soon
> 3. Detailed Analytics Report - Full statistical analysis - Coming soon  
> 4. Raw Data Export - CSV format - Coming soon"

**POINT TO:** Executive Summary card

**SAY:**
> "The Executive Summary includes:
> - Assessment overview with key metrics
> - Sentiment heatmap visualization
> - Capability radar chart
> - Benchmark comparisons
> - Problem categories from AI analysis
> - Top 5 intervention recommendations
> - ROI estimates
> - Implementation roadmap"

**CLICK:** "Generate & Download" button (or "Quick Export PDF")

**SAY:**
> "When you click this, the system generates the PDF. This takes 10-30 seconds depending on data volume."

**(IF IT WORKS):** PDF downloads

**SAY:**
> "The PDF downloads automatically and is ready to share with stakeholders."

**(IF IT FAILS):** Error or nothing happens

**SAY:**
> "PDF generation depends on backend configuration. If the export service isn't running, you'll need to configure that. But the format and structure is defined - here's what a sample output looks like." 

**SHOW:** Prepared sample PDF or screenshots

---

### [11:00 - 12:00] Additional Features & Wrap-Up

**SAY:**
> "Let me show you a few additional features quickly."

**PRESS:** Number keys (1, 2, 3, 4, 5) to jump between sections

**SAY:**
> "Keyboard navigation - press 1-5 to jump directly to each section. Arrow keys to go forward/back. Press F on sentiment or capability pages to toggle filters."

**BACK TO:** Sentiment or Capability page

**DEMONSTRATE:** Applying multiple filters (Region + Department)

**SAY:**
> "You can apply multiple filters simultaneously. Every calculation recalculates based on the filtered subset. Sentiment zones, capability dimensions, overall readiness, benchmarks, AI insights - everything updates."

**CLEAR FILTERS**

**SAY:**
> "To summarize what this software does:
> 
> **Input:** Employee survey data (CSV) with 25 sentiment scores + 32 capability scores per person
> 
> **Processing:** 
> - Calculates averages, minimums, maximums
> - Ranks sentiment zones 1-25
> - Compares to benchmark database
> - Identifies problem patterns
> - Matches interventions to gaps
> 
> **Output:**
> - Executive dashboard with composite metrics
> - Interactive heatmap showing 25 sentiment zones
> - Radar chart showing 8 capability dimensions  
> - AI-generated problem categories
> - 5 prioritized intervention recommendations
> - Exportable PDF report
> 
> **Key capabilities:**
> - Real-time filtering by segment
> - Benchmark comparison (150+ companies)
> - ROI estimation for interventions
> - Professional stakeholder reports
> 
> **Technical status:** Core features functional, some refinements ongoing (like PDF export and construct-level drilldowns)."

---

## ❓ Q&A - Common Questions & Answers

### "How does the data get into the system?"

**ANSWER:**
> "Currently via CSV upload. The file needs specific column headers - 25 for sentiment (L1C1_Score through L5C5_Score), 32 for capability (D1C1_Score through D8C4_Score), plus metadata columns (Region, Department, etc.). The schema is documented. In the future, we can add API integrations with survey tools."

### "How are the benchmarks calculated?"

**ANSWER:**
> "Benchmarks are pre-calculated averages from our database of 150+ companies. We anonymize and aggregate previous client data. When you select 'Financial Services', it averages only financial services companies. We filter by industry code, region, and company size."

### "Can we customize the interventions?"

**ANSWER:**
> "Yes. The intervention library is stored in a database table. You can add custom interventions with your own descriptions, timelines, and matching rules. The current 5 are examples from our standard library."

### "What about data privacy?"

**ANSWER:**
> "All respondent data is anonymized. We store scores and metadata but no names or personal identifiers. Exports contain only aggregated data. The system can be deployed on-premise for full data control."

### "How long does analysis take?"

**ANSWER:**
> "Calculations are real-time. When you upload data or apply filters, results appear in 1-2 seconds. The AI insights generation takes ~1.5 seconds (currently mock data; real GPT would take 5-10 seconds). PDF generation takes 10-30 seconds."

### "Can we track progress over time?"

**ANSWER:**
> "Yes. Upload new data each quarter (Q1, Q2, etc.) and compare metrics. You'll see if sentiment improved, which capability dimensions increased, whether interventions worked. The quarterly tracking workflow is documented."

### "What's the minimum sample size?"

**ANSWER:**
> "Recommend at least 30 respondents for statistical validity. The system works with smaller samples but results may not be reliable. Filtering can reduce sample size - we show warnings if filtered subset is too small."

### "How accurate are the ROI estimates?"

**ANSWER:**
> "ROI estimates are directional, not precise. They're based on industry benchmarks and case studies of similar interventions. Actual results vary by implementation quality, context, and timeline. We typically see estimates accurate within ±15-20%."

### "Can we white-label this?"

**ANSWER:**
> "The platform is designed to be white-labeled. Logos, colors, company name, and branding are configurable. We can deploy separate instances for partners with their branding."

---

## 🎯 Demo Success Checklist

After demo, they should understand:

- [ ] **What data goes in** (employee survey responses)
- [ ] **What calculations happen** (averages, rankings, benchmarks)
- [ ] **What visualizations show** (heatmap, radar chart, dashboard)
- [ ] **How filtering works** (real-time recalculation)
- [ ] **What AI analysis does** (problem categorization)
- [ ] **How interventions are matched** (gaps → recommendations)
- [ ] **What exports look like** (PDF reports)
- [ ] **Current functional status** (core working, some features in progress)

---

## 📝 Post-Demo Actions

### Immediate (< 5 min)
- [ ] Share access credentials
- [ ] Send link to documentation
- [ ] Provide sample CSV files

### Same Day
- [ ] Send this guide via email
- [ ] Share sample PDF export
- [ ] Provide data schema documentation
- [ ] Send business playbook (separately)

### Within 3 Days
- [ ] Schedule training session if needed
- [ ] Answer technical questions
- [ ] Configure any customizations requested
- [ ] Set up their instance if deploying

---

## 🔧 Technical Handover Checklist

For business team to operate independently:

**Access:**
- [ ] Login credentials provided
- [ ] Environment URLs documented
- [ ] VPN/network access configured (if needed)

**Documentation:**
- [ ] Business Team Software Guide (this document)
- [ ] Business Playbook provided
- [ ] CSV schema reference shared
- [ ] API documentation (if relevant)

**Data:**
- [ ] Sample/demo data loaded
- [ ] Real data import process explained
- [ ] Backup/export procedures documented

**Support:**
- [ ] Dev team contact info provided
- [ ] Bug reporting process explained
- [ ] Enhancement request procedure defined
- [ ] Escalation path documented

---

## 📋 Known Issues & Limitations

**Be Transparent About:**

1. **PDF Export** - Depends on backend service configuration
2. **AI Insights** - Currently uses mock data; real GPT integration ready but needs API key
3. **Construct Drilldown** - Clicking dimensions to see 4 constructs partially implemented
4. **Real-Time Benchmarks** - Using static benchmark data; live updates not implemented
5. **Multi-Tenant** - Single organization per instance; multi-tenant features not built
6. **Authentication** - Basic auth; no RBAC or SSO yet
7. **Mobile Responsive** - Optimized for desktop; mobile experience limited

**In Progress:**
- PowerPoint export
- Detailed analytics report
- Raw CSV export
- Multi-organization support
- Advanced filtering options

---

## ✅ Delivery Confirmation

Before considering handover complete:

- [ ] Business team can login successfully
- [ ] They can navigate all 5 main sections
- [ ] They understand what each metric means
- [ ] They can apply filters and see updates
- [ ] They can generate AI insights
- [ ] They know how interventions are matched
- [ ] They can attempt PDF export
- [ ] They have documentation access
- [ ] They know who to contact for support
- [ ] They understand current limitations

---

**SOFTWARE DELIVERED. READY FOR BUSINESS TEAM USE.**

