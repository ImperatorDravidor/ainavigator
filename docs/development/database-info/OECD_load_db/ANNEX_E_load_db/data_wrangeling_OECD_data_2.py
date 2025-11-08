# -*- coding: utf-8 -*-
"""
Created on Thu Oct 16 16:14:00 2025

@author: baroc
"""
import pandas as pd
from io import StringIO
import re

# --- Load your file ---
file_path = "tabula-OECD data.csv"

# Read the file line-by-line
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# --- Helper: check if a line is "blank" (only commas, spaces, etc.) ---
def is_blank(line):
    return re.sub(r"[,\s]", "", line) == ""

# --- Step 1: Split into tables based on blank lines ---
tables = []
current_table = []

for line in lines:
    if is_blank(line):
        if current_table:
            tables.append(current_table)
            current_table = []
    else:
        current_table.append(line)

# Add last table if file doesn't end with blank line
if current_table:
    tables.append(current_table)

print(f"🔹 Found {len(tables)} table blocks in file.")

# --- Step 2: Parse each block into its own DataFrame ---
for i, table_lines in enumerate(tables, start=1):
    # Join lines and fix spacing → treat multiple spaces as column separators
    table_text = "".join(table_lines)
    table_text = re.sub(r"[ ]{2,}", ",", table_text.strip())  # replace 2+ spaces with comma
    table_text = table_text.replace("\t", ",")  # tabs to commas

    # Read into DataFrame
    try:
        df = pd.read_csv(StringIO(table_text), on_bad_lines="skip")
    except Exception as e:
        print(f"⚠️ Error reading table {i}: {e}")
        continue

    # Drop completely empty rows/cols
    df = df.dropna(how="all", axis=0)
    df = df.dropna(how="all", axis=1)

    # Save to global variable
    globals()[f"df{i}"] = df
    print(f"Created df{i} with shape {df.shape}")

# --- Step 3: Summary ---
print(f"\nSuccessfully created {len(tables)} DataFrames.")
print("Access them as df1, df2, df3, ... etc.")


