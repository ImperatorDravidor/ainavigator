AI Navigator – Web Summit MVP  
Product Requirements Document (PRD) – Draft v1.0



 1. Product Overview

 1.1 Purpose  
AI Navigator is a data-driven platform designed to help organizations assess, understand, and accelerate their readiness for AI adoption. It provides insights into emotional sentiment toward AI, organizational capability maturity, and targeted improvement actions. The platform enables users to explore gaps, identify interventions, and understand potential impact.

 1.2 Vision Context (for demo narrative)  
AI adoption often fails due to emotional resistance, unclear capability levels, and uncertainty in decision-making. AI Navigator aims to provide clarity by revealing both sentiment-based blockers (how people feel) and capability-based maturity levels (how ready the organization is), then guiding users toward meaningful actions.

 1.3 Why This MVP Exists  
The Web Summit MVP must demonstrate the platform’s value by behaving like a functioning product: it should ingest data, dynamically update insights, visualize readiness and capability gaps, recommend actions, and preview potential impact. It is designed to showcase the product’s intelligence, interactivity, and market viability.



 2. Web Summit MVP Objective

 2.1 Objective  
Deliver a fully interactive MVP prototype that demonstrates AI Navigator’s ability to:
- Accept user-provided data
- Recalculate insights dynamically
- Display sentiment readiness and capability maturity
- Recommend guided actions
- Provide a directional ROI glimpse
- Export a summary report

 2.2 Success Criteria  
- Can run live without external dependencies.
- A full insight journey can be completed in under 3 minutes.
- Visualizations visibly change based on data uploads and filters.
- Both sentiment-based and capability-based journeys are functional.
- Spotlight interventions include deeper explanations.
- ROI glimpse feels grounded and relevant.
- A PDF export is available for summary output.



 3. Target User and Core Use Case

 3.1 Demo Persona Simulation  
The prototype will simulate usage by a role such as:
- Chief Innovation Officer  
- AI Transformation Lead  
- Head of People or Capability Development  
- Enterprise Change Leader  
- Strategy or AI Adoption Consultant  
- Investor evaluating product potential

 3.2 User Questions the MVP Must Address  
- What is the organization’s emotional readiness for AI?
- Where are we strong or weak in AI capabilities?
- Which actions will best improve sentiment or capability gaps?
- What potential improvement or ROI may result?
- Can this platform support decision-making and increase confidence?



 4. MVP Scope Overview

 4.1 In Scope (Web Summit MVP)
- Sentiment Heatmap (25 predefined zones based on sentiment levels × reasons)
- Capability Diamond (8 dimensions, each with 4 constructs; two-level radar visualization)
- CSV-based data upload with recalculation of all results
- Filtering (e.g., region, role, function, age group if present in data)
- Dynamic averaging, min/max, and benchmark comparison
- Action Plan generation triggered by sentiment or capability insights
- Spotlight interventions (3–5) with expanded documentation
- Directional ROI glimpse linked to spotlight interventions
- PDF export of summarized insights

 4.2 Out of Scope (Future Phases)
- Full financial ROI modeling
- Advanced simulation or comparative scenarios
- Comprehensive benchmark datasets across multiple industries
- Full credibility case repository
- Gamification, progress scoring, and user engagement metrics
- Complex multi-factor AI recommendation engine beyond rule-based spotlight suggestions
- Multi-user authentication and long-term account management (unless needed for upload security)



 5. High-Level MVP User Flows

 5.1 Sentiment Flow
1. User uploads or selects a sample sentiment dataset.  
2. The system generates the 25-zone Sentiment Heatmap.  
3. User applies filters (e.g., Region, Department).  
4. The heatmap recalculates dynamically based on filtered averages.  
5. User clicks a sentiment cell to view description and meaning.  
6. The system proposes one or more spotlight interventions.  
7. User selects an intervention and views detailed documentation.  
8. User proceeds to a directional ROI glimpse.  
9. User can export a PDF summary.

 5.2 Capability Flow
1. User uploads or selects a sample capability dataset.  
2. The system generates a top-level Capability Diamond (8-dimension radar) with average, min, and max values.  
3. User applies filters (e.g., Function, Age Group, Region).  
4. The diamond recalculates dynamically.  
5. User clicks a dimension to view a second-level radar chart (4 constructs).  
6. The system identifies weaker constructs.  
7. Spotlight interventions are suggested.  
8. User views deeper documentation.  
9. A directional ROI glimpse is presented.  
10. User can export a PDF summary.

 6. Functional Requirements (By Module)

 6.1 Data Upload & Processing Module

**Purpose:**  
Enable the user to upload a structured dataset (CSV format) that includes both sentiment data and capability assessment data. The system must recalculate visuals, benchmarks, summaries, and recommendations based on the uploaded data.

**Requirements:**
1. The system must accept a CSV file upload via an upload interface.
2. A predefined CSV structure will be provided for:
   - Sentiment responses (mapped to one of the 25 sentiment areas)
   - Capability dimension/construct scores (32 numeric fields)
   - Open-ended text responses (linked to each respondent’s capability perception)
   - Metadata fields for segmentation (e.g., region, function, age group, business unit)
3. After upload, the system must:
   - Parse and validate the structure.
   - Handle incorrect formats with clear error messaging.
   - Store the uploaded dataset in memory for session use.
4. The system must automatically:
   - Aggregate sentiment scores into the 25 sentiment areas.
   - Aggregate capability scores into 8 dimension-level averages (plus min/max).
   - Aggregate construct-level data for dimension drilldowns.
   - Maintain respondent-level metadata for filtering.
5. All visual modules must update based on recalculated data.
6. No persistent storage is required beyond current session (unless agreed otherwise).
7. Filter changes must trigger recalculation in real time.



 6.2 Sentiment Heatmap Module (WoW1 for MVP)

**Purpose:**  
Visualize emotional readiness and resistance using a 25-cell matrix defined by sentiment level (rows) and reason (columns).

**Requirements:**
1. The sentiment model consists of a fixed 5×5 grid (25 sentiment areas).
2. Each area corresponds to a unique combination of sentiment level and sentiment driver/reason.
3. Each area has:
   - A predefined label (from provided spreadsheet).
   - A predefined description.
   - Suggested interventions (configured per area).
4. Based on the dataset, the system computes an average sentiment score for each area.
5. The heatmap must:
   - Display each of the 25 areas.
   - Apply a color gradient based on computed averages (e.g., high resistance = red, neutral = yellow, high readiness = green).
6. When a user clicks an area:
   - A panel or modal must open displaying:
     - The area’s title.
     - Description text.
     - The current average score.
     - Optional comparison to benchmark or tolerances.
     - Recommended spotlight interventions (if relevant).
7. Filters must recalculate scores before display.
8. Benchmarks may be shown as reference thresholds, based on industry and region.
9. The user must have an option to proceed from this view into Intervention Details view.



 6.3 Capability Diamond Module (WoW2 for MVP)

**Purpose:**  
Enable capability-focused exploration through a two-level radar visualization of organizational maturity.

**Top-Level Visualization – 8 Dimensions:**
1. The system displays a radar chart with 8 axes representing capability dimensions:
   - Strategy and Vision
   - Data
   - Technology
   - Talent and Skills
   - Organisation and Processes
   - Innovation
   - Adaptation & Adoption
   - Ethics and Responsibility
2. For each dimension, the system calculates:
   - Average score (mandatory)
   - Minimum score (optional, based on confirmation)
   - Maximum score (optional, based on confirmation)
3. Benchmark averages (industry/region) may be represented as a comparison polygon or line.

**Second-Level Visualization – Constructs (4 per dimension):**
1. Clicking a dimension loads a second radar chart.
2. This chart shows 4 constructs corresponding to that dimension.
3. Only averages are required for MVP (min/max optional).
4. Benchmark values should be shown if available.
5. Constructs represent more specific capability statements from the dataset.

**Open-Ended Responses:**
1. Each capability dataset includes open-text responses per respondent.
2. The system aggregates open responses within the active segment.
3. A basic AI summary feature produces:
   - A short paragraph OR 3–5 key insights (to be defined).
4. The summary updates based on filters and selected dimension context.

**User Interaction Requirements:**
1. User must be able to toggle between top-level and construct-level views.
2. System highlights weaker dimensions or constructs.
3. User can select “Explore recommended actions” to proceed to Intervention Details.



 6.4 Filtering & Benchmarking Logic

**Purpose:**  
Allow the user to isolate data views by segmentation factors and compare them to industry/regional benchmarks.

**Requirements:**
1. Supported segmentation fields depend on dataset. Minimum required:
   - Industry (for benchmark)
   - Region (for benchmark)
2. Optional:
   - Business function
   - Age group
3. Filters must:
   - Recalculate averages dynamically.
   - Update all visualizations in real time.
   - Update AI summaries accordingly.
4. Benchmark comparisons:
   - Industry + region benchmarks must be applied automatically if available.
   - Optional segmentation (e.g., age group) modifies benchmark if dataset supports it.



 6.5 Spotlight Interventions & Action Plan Recommendations

**Purpose:**  
Guide users toward improvement using a small set of curated, well-defined “Spotlight Interventions.”

**Requirements:**
1. MVP must include 3–5 spotlight interventions.
2. Each spotlight intervention includes:
   - Title
   - Detailed description (2–3 paragraphs)
   - Expected impact area (sentiment or capability)
   - Dimensions or constructs it improves
   - Directional ROI impact factors
3. In Sentiment Flow:
   - Clicking a sentiment cell displays 1–2 spotlight interventions linked to that sentiment reason or level.
4. In Capability Flow:
   - After viewing a dimension/construct gap, spotlight interventions specific to that area are shown.
5. The user can open a detailed intervention description screen.
6. This detailed view serves as the transition point to the ROI Glimpse stage.



 6.6 ROI Glimpse Feature

**Purpose:**  
Provide a directional sense of value for a selected spotlight intervention.

**Requirements:**
1. The ROI Glimpse should not simulate full financial modeling.
2. ROI Glimpse content should include:
   - Short explanation (e.g. “By closing this capability gap, companies typically see 8–15 percent efficiency improvements”).
   - Range-based or percentage-based directional indicators.
3. The ROI Glimpse must feel data-driven and tailored to the selected intervention.
4. User should have an option to proceed to export summary.



 6.7 PDF Export

**Purpose:**  
Enable users to extract insights into a presentable summary.

**Requirements:**
1. Export should compile:
   - Selected flow path (Sentiment or Capability)
   - Key visual (latest heatmap/dimension view)
   - Key insight summary (capability or sentiment)
   - Selected spotlight intervention summary
   - ROI glimpse summary
2. Single combined PDF export is sufficient for MVP.
3. Export should appear professional but does not need full branded final layout in MVP (structure can be improved later).



 6.8 Navigation & Flow Control

**Requirements:**
1. Entry screen prompts user to upload data or use demo dataset.
2. A starting choice must allow user to begin with:
   - Sentiment insights, or
   - Capability insights
3. Each module must offer an action to “View recommendations”.
4. Recommendations lead to spotlight intervention deep-dive.
5. Intervention deep-dive leads to ROI glimpse.
6. ROI glimpse leads to PDF export or return to main view.

 7. Data Structure & Calculation Logic (Functional Requirements)

 7.1 Data Input Structure

- The MVP will accept one or more CSV datasets provided by the internal data scientist.
- These datasets will already contain:
  - Sentiment-related survey responses, structured or mappable to one of the defined 25 sentiment areas.
  - Capability assessment scores for all 32 constructs (4 constructs per capability dimension).
  - At least one open-ended response field per respondent related to capability perceptions or barriers.
  - Metadata for filtering (e.g., region, function, age group, business unit).
- The developer is not expected to design the dataset structure from scratch, but must implement a consistent loader and aggregator based on final CSV specification provided by the data scientist.
 7.2 Calculation Ownership

- All aggregation, averaging, benchmarking, summarization, and trigger evaluation logic must be performed on the backend.
- The frontend must only render values received from the backend.

 7.3 Aggregation Logic: Sentiment Heatmap

- The 25 sentiment areas are predefined and grouped by sentiment level (rows) and sentiment reason (columns).
- Each sentiment area must have an average score calculated based on relevant respondent ratings.
- Calculations dynamically adjust based on active dataset and applied filters.
- If no respondents match a filtered condition, a clear “no data available” state must be returned.

 7.4 Aggregation Logic: Capability Assessment

- Each of the 8 capability dimensions must be calculated as the average of its 4 constructs.
- Construct averages are calculated based on all filtered respondent scores.
- Where required, minimum and maximum dimension scores must be calculated using filtered records.
- Benchmark comparisons must be provided per dimension using available values for the specified industry and region (and additional optional segments if supported).

 7.5 Drill-Down Logic

- When a capability dimension is selected, a second-level visualization must show the 4 constructs for that dimension.
- At this level, only the construct averages are required for MVP.
- Benchmark comparisons at the construct level may be included if available.

 7.6 Filtering Logic

- Filters may include industry, region, business function, age group, or other metadata where available.
- Filters must affect all recalculated scores: sentiment areas, capability dimensions, constructs, and open-text summaries.
- Benchmark selection must always be aligned to industry and region at minimum; additional filters are optional depending on benchmark availability.

 7.7 Open-Ended Response Summarization

- Open-text responses provided during the capability scan must be aggregated for the active respondent subset.
- A short AI-generated summary (e.g. one paragraph or bullet-format insights) must be provided based on filtered data.
- Summaries must update when filters change.

 7.8 Intervention Trigger Logic

- Each sentiment area and capability construct can be associated with one or more spotlight interventions.
- When a sentiment area or capability construct is below a certain threshold or significantly below benchmark level, relevant spotlight interventions must be recommended.
- A small, curated list of spotlight interventions will be defined and linked to specific gaps or triggers.

 7.9 ROI Glimpse Logic

- Each spotlight intervention must have an indicative directional improvement estimate (e.g. “can improve efficiency by 8–15%” or “can increase confidence significantly”).
- The ROI glimpse will display this estimate without requiring financial calculations.
- The ROI glimpse must feel connected to the selected intervention and underlying capability or sentiment gap.



 8. Technical & Performance Expectations (Functional-Level Requirements)

 8.1 Backend Responsibility

- The backend must handle:
  - CSV upload validation
  - Subset-based aggregation (averages, min, max)
  - Benchmark comparisons
  - Trigger evaluation for interventions
  - AI-based summarization of open-ended responses
  - Returning all processed data in a structured response

- The frontend must rely entirely on the backend for all calculated values.

 8.2 Dataset Handling

- Uploaded datasets must be processed for the current session.
- The system is not required to persist data beyond the session unless otherwise agreed.
- Errors such as invalid format or missing fields must result in clear validation messaging.

 8.3 Dynamic Update Performance

- Recalculation triggered by filtering should update results quickly (target experience: visually responsive and seamless).
- Open-text summarization may take longer; loading indicators must be used where needed.

 8.4 AI Summarization Constraints

- The MVP does not require highly advanced natural language understanding.
- A short, coherent summary of key pain points or themes is sufficient.
- Summaries must be clearly attributed as insights derived from respondent feedback.

 8.5 Benchmark Application

- Industry and region benchmarks are required.
- If optional benchmark segments (age group, function) are not available, the platform should still function normally without user confusion.
- System responses must handle missing benchmark cases gracefully.

 8.6 Error and Empty States

- If no data is available after filtering, the system must show clear messaging (e.g. “No data available for the selected segment”).
- If benchmark data is unavailable, the system must indicate that benchmark comparison is not available for this selection.

 8.7 MVP Reliability Expectations

- The MVP must function smoothly during live demonstration.
- No hidden dependencies should jeopardize a staged or live presentation.
- The experience must appear polished, responsive, and logically coherent.

 9. Out of Scope for MVP (Future Consideration)

The following elements are part of the broader AI Navigator vision but are explicitly excluded from the Web Summit MVP. They must not be designed, developed, or architected in this phase beyond simple placeholders or conceptual acknowledgment where necessary.

 9.1 Advanced ROI Simulation
A complete financial ROI calculator with detailed cost structures, scenario modeling, or time-phased impact projections will not be implemented in MVP. The MVP will only include a directional ROI glimpse linked to spotlight interventions.

 9.2 Comprehensive Peer Credibility and Case Library
A dynamic repository of real-world case studies, industry success stories, and similarity-based suggestions is reserved for later phases.

 9.3 Gamification and Engagement Mechanics
User progression tracking, badges, behavioral nudges, leaderboards, streaks, and motivational engagement systems are excluded from MVP.

 9.4 Multi-User Authentication and Organization Account Management
The MVP is not required to support persistent user accounts, organizational onboarding, or access management beyond what is minimally necessary to demonstrate functionality.

 9.5 Long-Term Data Persistence and Analytics Logging
Persistent database architectures enabling long-term usage analytics or multi-company comparisons are out of scope for MVP.

 9.6 Advanced AI Personalization or Adaptive Recommendations
Complex AI-based personalization or dynamic intervention optimization beyond rule-based spotlight associations is excluded.

 9.7 Full Market-Ready UI/UX Polish
While the MVP must be visually coherent, professional, and presentation-ready, it does not require fully finalized visual design systems, animations, or production-grade responsiveness optimizations.
 10. Success Criteria for Web Summit MVP

The Web Summit MVP is considered successful if the following criteria are met:

 10.1 Functional Demonstration Success
- A complete end-to-end journey can be demonstrated live, starting from data upload and progressing through insights, recommendations, and an ROI glimpse, ending with a PDF export.
- Both primary paths (Sentiment-driven flow and Capability-driven flow) are functional and feel coherent.
- All values shown in sentiment and capability views are derived from dynamic aggregation rather than static displays.

 10.2 Data Responsiveness
- Uploading a new dataset visibly updates all outputs.
- Filtering changes (e.g. selecting a region or business function) result in clear recalculation of averages and visual output adjustments.
- Open-ended response summaries change appropriately when filtered.

 10.3 Interactivity and Insight Perception
- Heatmap cells, capability dimensions, and construct nodes respond correctly to user selection.
- Spotlight interventions feel contextually relevant to the selected sentiment/capability gap.
- The ROI glimpse is directly linked to the selected spotlight intervention and provides a meaningful sense of improvement potential.

 10.4 Visual Clarity and Professional Impression
- Heatmap and radar diagrams are visually clean, easy to interpret, and suitable for executive-level presentation.
- The system visually conveys capability gaps or sentiment problem areas without requiring deep explanation.
- Benchmark comparisons are clearly distinguishable from current dataset visualizations.

 10.5 Stability and Demo Readiness
- The system does not produce errors during expected demo interactions.
- Edge cases (e.g. empty filters or zero respondents) produce readable, well-explained fallback states.
- The MVP runs smoothly on typical demo hardware without internet instability risks (if offline demo mode is used).

 10.6 Documented Narrative Flow
- The output supports a short scripted demo narrative such as:
  - “Here is how people feel about AI in your company”
  - “Here is where capability gaps exist”
  - “Here is a suggested high-impact action”
  - “Here is an estimate of why acting on this matters”

 10.7 Export Success
- A PDF export can be generated summarizing key results (recent insight view, action choice, ROI glimpse).

 10.8 Positive Stakeholder Validation
- The demo is perceived as intelligent, useful, professional, and commercially viable.
- Investors or potential users understand the product’s value proposition after the demo.

