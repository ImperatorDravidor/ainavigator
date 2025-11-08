# -*- coding: utf-8 -*-
"""
Created on Thu Oct  9 14:07:37 2025

@author: baroc
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import uuid

# =====================================================
# CONFIGURATION
# =====================================================
SCALE_FACTOR = 300   # Increase for more synthetic data (e.g., 1000 = ~93k rows)
OUTPUT_FILE_BASE = "Sentiments_3NF_"
INPUT_FILE = "Sentiments_data - Sheet1.csv"
# =====================================================

# 1️⃣ LOAD BASE DATA
df = pd.read_csv(INPUT_FILE)
df['StartDate'] = pd.to_datetime(df['StartDate'], format='%m/%d/%y %H:%M', errors='coerce')
df['is_synthetic'] = 0

# Replace missing demographics
df = df.assign(
    Afdeling=df['Afdeling'].fillna('Onbekend'),
    Dienstverband=df['Dienstverband'].fillna('Onbekend'),
    Leeftijd=df['Leeftijd'].fillna('Onbekend')
)

# =====================================================
# CLEAN SURVEY DATA
# =====================================================
survey_cols = [c for c in df.columns if any(c.startswith(x) for x in ['A', 'I', 'E', 'O', 'H'])]
dimensions = ['A', 'I', 'E', 'O', 'H']

# Convert to numeric (non-numeric -> NaN)
for col in survey_cols:
    df[col] = pd.to_numeric(df[col], errors='coerce')

# Fill missing with random integers from valid values
for col in survey_cols:
    valid = df[col].dropna().astype(int)
    if not valid.empty:
        df[col] = df[col].apply(lambda x: np.random.choice(valid) if pd.isna(x) else int(x))
    else:
        df[col] = 3

# =====================================================
# ADD REGIONS AND CLEAN CATEGORICAL FIELDS
# =====================================================
regions = [
    "Noord-Holland", "Zuid-Holland", "Utrecht", "Limburg", "Gelderland",
    "Overijssel", "Friesland", "Drenthe", "Zeeland", "Flevoland"
]
df['Region'] = np.random.choice(regions, size=len(df))

extra_afdelingen = [
    "Financiën", "HR", "Marketing", "Communicatie", "ICT", "Klantenservice",
    "Strategie & Innovatie", "Onderhoud & Beheer", "Projectmanagement",
    "Duurzaamheid", "Inkoop", "Kwaliteit & Veiligheid", "Operations",
    "Onderzoek & Ontwikkeling", "Supply Chain", "Sales", "Data & Analytics"
]

dienst_choices = ["<3 jaar", "3-10 jaar", "10-20 jaar", ">20 jaar"]
age_choices = ["<25", "25-35", "35-45", "45-55", "55+"]

# --- Clean Afdeling ---
df['Afdeling'] = df['Afdeling'].astype(str)
df['Afdeling'] = df['Afdeling'].replace(['', 'None', 'nan', 'NaN', 'Onbekend'], np.nan)

# Remove numeric-like afdeling values
df['Afdeling'] = df['Afdeling'].apply(
    lambda x: x if isinstance(x, str) and not x.replace(' ', '').isdigit() else np.nan
)

# Fill missing with random Afdelingen
mask = df['Afdeling'].isna()
df.loc[mask, 'Afdeling'] = np.random.choice(extra_afdelingen, size=mask.sum())

# Clean Dienstverband + Leeftijd
df['Dienstverband'] = np.where(
    df['Dienstverband'].isin(dienst_choices),
    df['Dienstverband'],
    np.random.choice(dienst_choices, size=len(df))
)

df['Leeftijd'] = np.where(
    df['Leeftijd'].isin(age_choices),
    df['Leeftijd'],
    np.random.choice(age_choices, size=len(df))
)

# =====================================================
# SYNTHETIC DATA GENERATION (PATTERN-BASED)
# =====================================================
n_synth = len(df) * SCALE_FACTOR
synthetic = df.sample(n=n_synth, replace=True).copy()

# Generate correlated synthetic scores per dimension
for dim in dimensions:
    cols = [c for c in survey_cols if c.startswith(dim)]
    df_subset = df[cols].apply(pd.to_numeric, errors='coerce').dropna()
    if df_subset.empty:
        continue

    means = df_subset.mean().values
    cov = df_subset.corr().values
    cov = np.nan_to_num(cov)
    cov = (cov + cov.T) / 2
    np.fill_diagonal(cov, 1.0)

    synth_values = np.random.multivariate_normal(means, cov * 0.4, size=n_synth)
    synth_values = np.clip(np.round(synth_values), 1, 5).astype(int)
    for i, col in enumerate(cols):
        synthetic[col] = synth_values[:, i]

# Demographics
synthetic['Region'] = np.random.choice(regions, size=n_synth)
afdeling_choices = [str(x) for x in extra_afdelingen + list(df['Afdeling'].unique()) if pd.notna(x)]
synthetic['Afdeling'] = np.random.choice(afdeling_choices, size=n_synth)
synthetic['Dienstverband'] = np.random.choice(dienst_choices, size=n_synth)
synthetic['Leeftijd'] = np.random.choice(age_choices, size=n_synth)
synthetic['DistributionChannel'] = np.random.choice(df['DistributionChannel'].unique(), size=n_synth)

# Random realistic dates
start_date = datetime(2024, 1, 1)
synthetic['StartDate'] = [start_date + timedelta(days=int(x)) for x in np.random.randint(0, 365, size=n_synth)]

synthetic['ResponseId'] = [f"SYNTH_{i:06d}" for i in range(n_synth)]
synthetic['is_synthetic'] = 1

# Combine real + synthetic data
df_big = pd.concat([df, synthetic], ignore_index=True)
print(f"Combined dataset shape: {df_big.shape}")

# =====================================================
# NORMALIZE TO 3NF STRUCTURE
# =====================================================
respondent_cols = ['Region', 'Afdeling', 'Dienstverband', 'Leeftijd', 'UserLanguage', 'is_synthetic']
respondents = df_big[respondent_cols].drop_duplicates().reset_index(drop=True)
respondents['RespondentID'] = [uuid.uuid4().hex[:8] for _ in range(len(respondents))]

df_big = df_big.merge(respondents, on=respondent_cols, how='left')

session_cols = ['ResponseId', 'RespondentID', 'StartDate', 'Finished', 'DistributionChannel']
sessions = df_big[session_cols].drop_duplicates().reset_index(drop=True)
sessions['SessionID'] = [uuid.uuid4().hex[:8] for _ in range(len(sessions))]

df_big = df_big.merge(sessions[['ResponseId', 'SessionID']], on='ResponseId', how='left')

responses = df_big.melt(
    id_vars=['SessionID'],
    value_vars=survey_cols,
    var_name='QuestionCode',
    value_name='Score'
)

# =====================================================
# EXPORT TO CSV (Database Ready)
# =====================================================
respondents.to_csv(f"{OUTPUT_FILE_BASE}Respondent.csv", index=False)
sessions.to_csv(f"{OUTPUT_FILE_BASE}Session.csv", index=False)
responses.to_csv(f"{OUTPUT_FILE_BASE}Response.csv", index=False)

print(f"""
Exported 3NF CSVs ready for relational import:
- Respondent: {respondents.shape}
- Session: {sessions.shape}
- Response: {responses.shape}

Files saved as:
{OUTPUT_FILE_BASE}Respondent.csv
{OUTPUT_FILE_BASE}Session.csv
{OUTPUT_FILE_BASE}Response.csv
""")




