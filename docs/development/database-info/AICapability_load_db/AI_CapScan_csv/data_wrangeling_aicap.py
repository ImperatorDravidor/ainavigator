# -*- coding: utf-8 -*-
"""
Created on Thu Oct  9 15:01:26 2025

@author: baroc
"""

import pandas as pd
import numpy as np
import uuid

# =====================================================
# CONFIGURATION
# =====================================================
SCALE_FACTOR = 300  # Adjust how much synthetic data to add
INPUT_FILE = "dataset_AI_capscan - Sheet1.csv"
OUTPUT_PREFIX = "AI_CapScan_3NF_"
# =====================================================

# 1️⃣ LOAD & CLEAN BASE DATA
df = pd.read_csv(INPUT_FILE)
df.columns = [c.strip() for c in df.columns]
df['is_synthetic'] = 0

# Infer categorical and numeric columns
categorical_cols = [c for c in df.columns if df[c].dtype == 'object']
numeric_cols = [c for c in df.columns if pd.api.types.is_numeric_dtype(df[c])]

# Convert numeric-like strings
for col in df.columns:
    df[col] = pd.to_numeric(df[col], errors='ignore')

# =====================================================
# 2️⃣ FILL MISSING VALUES
# =====================================================
for col in categorical_cols:
    df[col] = df[col].fillna("Onbekend")

for col in numeric_cols:
    df[col] = pd.to_numeric(df[col], errors='coerce')
    median_val = df[col].median()
    df[col] = df[col].fillna(median_val)

# =====================================================
# 3️⃣ SYNTHETIC DATA GENERATION
# =====================================================
n_synth = len(df) * SCALE_FACTOR
synthetic = df.sample(n=n_synth, replace=True).copy()

# Add random but correlated noise to numeric columns
for col in numeric_cols:
    mean = df[col].mean()
    std = df[col].std() if df[col].std() > 0 else 1
    synthetic[col] = np.clip(
        synthetic[col] + np.random.normal(0, std * 0.2, size=n_synth),
        mean - 3 * std, mean + 3 * std
    ).round(2)

# Shuffle categorical values slightly
for col in categorical_cols:
    unique_vals = df[col].unique()
    synthetic[col] = np.random.choice(unique_vals, size=n_synth)

# Mark and ID records
synthetic['is_synthetic'] = 1
synthetic['RecordID'] = [f"SYNTH_{i:07d}" for i in range(n_synth)]
df['RecordID'] = [f"REAL_{i:07d}" for i in range(len(df))]

# Combine
df_full = pd.concat([df, synthetic], ignore_index=True)
print(f"Combined dataset: {df_full.shape[0]} rows, {df_full.shape[1]} columns")

# =====================================================
# 4️⃣ NORMALIZE TO 3NF STRUCTURE
# =====================================================
dim_tables = {}

# Create dimension tables from categorical columns
for col in categorical_cols:
    dim_df = pd.DataFrame({col: df_full[col].unique()})
    dim_df[f"{col}_id"] = [uuid.uuid4().hex[:8] for _ in range(len(dim_df))]
    dim_tables[col] = dim_df

# Replace categorical values with IDs in the main dataset
df_norm = df_full.copy()
for col, dim_df in dim_tables.items():
    df_norm = df_norm.merge(dim_df, on=col, how='left')
    df_norm.drop(columns=[col], inplace=True)

# Build fact table
fact_cols = [f"{col}_id" for col in categorical_cols] + numeric_cols + ["RecordID", "is_synthetic"]
fact_table = df_norm[fact_cols].copy()

# =====================================================
# 5️⃣ EXPORT TO CSV
# =====================================================
for col, dim_df in dim_tables.items():
    dim_df.to_csv(f"{OUTPUT_PREFIX}{col}.csv", index=False)

fact_table.to_csv(f"{OUTPUT_PREFIX}fact_table.csv", index=False)

print("\nExported 3NF tables:")
for col in dim_tables:
    print(f"- {OUTPUT_PREFIX}{col}.csv")
print(f"- {OUTPUT_PREFIX}fact_table.csv")

