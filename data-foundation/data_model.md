# Logical Data Model (3NF)

**Respondent**
| Field | Type | Description |
|--------|------|-------------|
| RespondentID | string | Unique respondent |
| Region | string | Respondent region |
| Department | string | Business unit |
| Employment_type | string | Experience group |
| Age | string | Age group |
| UserLanguage | string | Survey language |

**Session**
| Field | Type | Description |
|--------|------|-------------|
| SessionID | string | Unique session |
| RespondentID | string | Links to Respondent |
| Finished | int | 1 = complete |

**Response**
| Field | Type | Description |
|--------|------|-------------|
| SessionID | string | Links to Session |
| QuestionCode | string | Sentiment question code |
| Score | float | Sentiment rating (1–5) |



# Logical Data Model (3NF) — Capability Data

**Respondent**
| Field | Type | Description |
|--------|------|-------------|
| ResponseId_id | string | Unique respondent identifier |
| industry_synthetic | string | Synthetic industry segment |
| country_synthetic | string | Synthetic country (local region) |
| continent_synthetic | string | Synthetic continent (global region) |
| role_synthetic | string | Synthetic organizational role or level |

**CapabilityDimension**
| Field | Type | Description |
|--------|------|-------------|
| dimension_id | integer | Unique ID for each capability dimension (1–8) |
| dimension | string | Name of the capability dimension (e.g., "Technology") |

**CapabilityConstruct**
| Field | Type | Description |
|--------|------|-------------|
| construct_id | integer | Unique ID for each construct (1–32) |
| construct | string | Name of the construct (e.g., "Data Architecture") |
| dimension_id | integer | Foreign key → CapabilityDimension.dimension_id |
| dimension | string | Redundant label for readability (optional) |

**CapabilityResponse**
| Field | Type | Description |
|--------|------|-------------|
| ResponseId_id | string | Foreign key → Respondent.ResponseId_id |
| construct_id | integer | Foreign key → CapabilityConstruct.construct_id |
| score | float | Capability score (1–5) |
