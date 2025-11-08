# -*- coding: utf-8 -*-
"""
Created on Thu Oct  9 16:47:14 2025

@author: baroc
"""

import pandas as pd
import uuid

# =====================================================
# CONFIGURATION
# =====================================================
INPUT_FILE = "Enterprise_GenAI_Adoption_Impact.csv"
OUTPUT_PREFIX = "GenAI_3NF_"
# =====================================================

# 1️⃣ LOAD DATA
df = pd.read_csv(INPUT_FILE)
df.columns = [c.strip() for c in df.columns]

# Show structure
print(f"Loaded dataset: {df.shape[0]} rows, {df.shape[1]} columns")

# 2️⃣ CREATE DIMENSION TABLES (KEEP MISSING VALUES)
def make_dim(df, col):
    dim_df = pd.DataFrame({col: df[col].drop_duplicates(keep='first')})
    dim_df[f"{col}_id"] = [uuid.uuid4().hex[:8] for _ in range(len(dim_df))]
    return dim_df

dim_company = make_dim(df, "Company Name")
dim_industry = make_dim(df, "Industry")
dim_country = make_dim(df, "Country")
dim_tool = make_dim(df, "GenAI Tool")

# 3️⃣ REPLACE VALUES WITH FOREIGN KEYS (PRESERVE NULLS)
df_norm = df.copy()

for dim_df, col in [
    (dim_company, "Company Name"),
    (dim_industry, "Industry"),
    (dim_country, "Country"),
    (dim_tool, "GenAI Tool")
]:
    df_norm = df_norm.merge(dim_df, on=col, how="left")

# 4️⃣ FACT TABLE (KEEPING MISSING DATA)
fact_cols = [
    "Company Name_id", "Industry_id", "Country_id", "GenAI Tool_id",
    "Adoption Year", "Number of Employees Impacted",
    "New Roles Created", "Training Hours Provided",
    "Productivity Change (%)", "Employee Sentiment"
]

fact_table = df_norm[fact_cols].copy()
fact_table["RecordID"] = [uuid.uuid4().hex[:10] for _ in range(len(fact_table))]

# 5️⃣ EXPORT TO CSV
dim_company.to_csv(f"{OUTPUT_PREFIX}dim_company.csv", index=False)
dim_industry.to_csv(f"{OUTPUT_PREFIX}dim_industry.csv", index=False)
dim_country.to_csv(f"{OUTPUT_PREFIX}dim_country.csv", index=False)
dim_tool.to_csv(f"{OUTPUT_PREFIX}dim_tool.csv", index=False)
fact_table.to_csv(f"{OUTPUT_PREFIX}fact_genai_impact.csv", index=False)

print("\n Exported 3NF CSV files:")
for f in [
    "dim_company.csv", "dim_industry.csv", "dim_country.csv",
    "dim_tool.csv", "fact_genai_impact.csv"
]:
    print(f"- {OUTPUT_PREFIX}{f}")

