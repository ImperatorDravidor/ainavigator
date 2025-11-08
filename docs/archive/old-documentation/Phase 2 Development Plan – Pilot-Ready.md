# Phase 2 Development Plan – Pilot-Ready MVP (Developer-Focused)

## 1. Purpose of This Phase
We are not building a showcase-only demo. Phase 2 aims to create a working MVP that can be used in real pilot deployments with early customers (e.g., Barco, Vitens). This version must be stable, credible, and usable with real CSV uploads and basic benchmark comparison.

It should demonstrate end-to-end value: upload → insight → intervention → export.

The MVP will be deployed as a single-tenant instance per customer (manual setup is fine at this stage). Multi-tenant support is a later concern.

---

## 2. Foundation Tasks (Must Be Completed Before Further UI Expansion)

| Requirement | Purpose |
|------------|---------|
Enable Row-Level Security (RLS) | Ensures future compliance and controlled data access  
Define write/access policies | Supports safe scaling and prevents accidental exposure  
Run SQL migrations and seed scripts | Ensures reproducible DB structure and test data  
Create database in EU region | Necessary for GDPR expectations for European pilots  
Enable Point-in-Time Recovery (PITR) or daily backups | Required for pilot risk mitigation  
Seed synthetic datasets | Enables realistic flow testing and demo scenarios  
Add materialized/pre-aggregated heatmap and capability views | Improves performance and enables stable dashboards  
Implement basic smoke test for sentiment filtering and navigation | Confirms flow stability before adding complexity  
Add feature flag for AI-based components (optional or mock) | Allows disabling if latency or quota issues occur  
Add PDF fallback (e.g., HTML screenshot fallback) | Protects export flow under failure conditions  
Audit write-back operations (intervention choices) | Ensures traceability for pilots  

These items are part of the minimum technical quality bar required for a pilot-ready MVP and must be completed early in Phase 2.

---

## 3. Core MVP Features to Build (Functional Scope)

| Area | What must exist by end of Phase 2 |
|------|----------------------------------|
CSV Upload & Batch Handling | User uploads CSV files. Each upload is stored as a new batch.  
Snapshot Logic | The dashboard always reflects the most recent batch (“current state”).  
Sentiment Heatmap | Full 25-zone representation based on CSV structure.  
Capability Diamond | Top-level 8-dimension capability view.  
Construct Drilldown | Clicking a dimension reveals the 4 underlying constructs.  
Benchmark Overlay | Organisation results are compared vs a synthetic sector/regional benchmark dataset.  
Intervention Layer | Weak constructs or negative sentiment areas trigger mapped interventions.  
ROI Glimpse | A simple range-based estimation (e.g., +8–15% improvement).  
Export (One-Page) | PDF or HTML summary showing heatmap, capability state, benchmark gap, intervention, ROI.  
UI Flow Polish | Clean transitions from upload → insight → intervention → export.  
Single-Tenant Deploy Model | Each pilot customer runs a dedicated instance. Manual deployment is acceptable.  

---

## 4. Data Science Dependencies (Delivered by Our Data Scientist)

The developer will receive or collaborate on:
- Synthetic datasets that simulate various sector/regional profiles.
- Defined score distributions per construct and sentiment area.
- A benchmark table structure (sector x region x construct).
- A directional proposal on how updated datasets might influence future recency-based scoring (not fully implemented now).

---

## 5. Business and Scientific Dependencies

The business and scientific side will deliver:
- Construct → Intervention mapping.
- ROI range assumptions.
- Definitions of “weak vs strong” constructs.
- Example narrative lines for possible later AI-driven messaging.
- Validation that outputs make sense from a behavioral/business perspective.

---

## 6. Designer Inputs

The designer will deliver:
- Basic style system (colors, typography, spacing).
- Layout for intervention cards.
- A simple, professional layout for the export page.
- Guidance for narrative flow and transitions.

---

## 7. Development Order (Expected Build Sequence)

| Step | Task |
|------|------|
1 | Complete foundation tasks (RLS, migrations, seeds, PITR, EU deployment config)  
2 | Implement batch ingestion and snapshot logic  
3 | Build sentiment heatmap rendering from snapshot  
4 | Build capability diamond and construct drilldown  
5 | Integrate synthetic benchmark overlay  
6 | Implement rule-based intervention selection  
7 | Integrate ROI glimpse logic  
8 | Implement one-page export (PDF or HTML)  
9 | Apply UI flow and transitions  
10 | Prepare deployment model for single-tenant replication  

---

## 8. Out of Scope for This Phase (By Design)

| Excluded | Reason |
|----------|--------|
Full multi-tenant user/org-level structure | Introduced post-pilot  
Dynamic AI-generated summaries | Optional enhancement for later phases  
Time-weighted scoring over multiple updates | Will be introduced once snapshot logic is validated  
Multi-page reporting | One strong summary export is enough for MVP  
Automated client onboarding | Manual deployment per pilot is acceptable  
External benchmark ingestion (OECD, Eurostat) | Introduced after synthetic baseline is validated  

---

## 9. Expected Final Deliverable (End of Phase 2)

By the end of this phase, we expect:
- A working MVP deployed for pilot testing.
- Support for CSV uploads to update the current dashboard view.
- Drilldowns and benchmarks fully functional.
- Intervention and ROI logic implemented.
- Export working reliably.
- Data seeded and meaningful UI interactions validated.
- The system ready to enter a pilot with the first customer.
- Credible for investors as “already running in pilot.”

---

## 10. Next Step

After reviewing this plan, the developer should:
1. Confirm feasibility and raise any concerns or dependency gaps.
2. Suggest any refinements to sequencing.
3. Proceed into a sprint structuring session (if needed).

Once confirmed, this will guide execution for Phase 2.
