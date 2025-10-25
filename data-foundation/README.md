# Data Foundation – Milestones 1 & 3

Contains demo datasets and schemas for the **AI Navigator MVP**, supporting both the **Sentiment Heatmap (Milestone 1)** and **Capability Flow (Milestone 3)** modules.

## Files
- `sentiment_demo.csv` – Cleaned, denormalized sentiment dataset (25 sentiment areas)  
- `capability_demo.csv` – Construct-level capability dataset (8 dimensions × 4 constructs)  
- `csv_schema_definition.md` – Column definitions and validation rules for all datasets  
- `data_model.md` – Logical 3NF reference for sentiment and capability data  

## Usage
Use these datasets to test the following MVP modules:  
- `/api/upload` → Validate and parse uploaded CSVs  
- `/api/sentiment/heatmap` → Render the 25-area sentiment heatmap  
- `/api/capability/dimensions` & `/api/capability/constructs/:dimensionId` → Generate radar charts for capability dimensions and constructs  

Each row in:  
- **`sentiment_demo.csv`** = one respondent’s sentiment profile (1–5 scores, averaged if multiple sessions).  
- **`capability_demo.csv`** = one construct-level response linked to a respondent and synthetic filters (industry, country, role).
