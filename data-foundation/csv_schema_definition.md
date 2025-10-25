# CSV Schema – AI Navigator MVP

## Sentiment Data (sentiment_demo.csv)
Each row = one respondent.

| Column | Type | Example | Description |
|--------|------|----------|-------------|
| RespondentID | string | R001 | Unique respondent |
| Region | string | Utrecht | Region label |
| Department | string | HR | Business unit |
| Employment_type | string | 10–20 year | Tenure group |
| Age | string | 25–35 | Age group |
| UserLanguage | string | NL | Survey language |
| Sentiment_1 … Sentiment_25 | number (1–5) | 3.8 | Sentiment scores (averaged if duplicate sessions) |



CSV Schema – AI Navigator MVP
Capability Data (capability_demo.csv)

Each row = one construct-level response from a respondent.
Each respondent has up to 32 entries (4 constructs × 8 capability dimensions).

| Column | Type | Example | Description |
|---------|------|----------|--------------|
| ResponseId_id | string | R001 | Unique respondent identifier |
| dimension_id | number (1–8) | 3 | Numeric ID of the capability dimension |
| dimension | string | Technology | Name of the capability dimension |
| construct_id | number (1–32) | 9 | Numeric ID of the construct within the dimension |
| construct | string | Data Architecture | Construct name mapped to its dimension |
| score | number (1–5) | 4.2 | Average capability score for that construct |
| industry_synthetic | string | Manufacturing | Synthetic industry segment for filtering |
| country_synthetic | string | Netherlands | Synthetic country (local region) |
| continent_synthetic | string | Europe | Synthetic continent (global region) |
| role_synthetic | string | Leadership | Synthetic organizational role or level |

