# -*- coding: utf-8 -*-
"""
Created on Thu Oct  9 11:16:51 2025

@author: baroc
"""
import pandas as pd
from pathlib import Path
import re

pd.options.mode.chained_assignment = None


# ---------------------------------------------------------
# Helper: Extract metadata robustly
# ---------------------------------------------------------
def _meta_value(raw, label_substring):
    """Find the value next to a metadata label (e.g. 'Time frequency')."""
    target = label_substring.lower()
    for i in range(0, min(20, raw.shape[0])):
        row = raw.iloc[i]
        hit_cols = [j for j, v in enumerate(row) if pd.notna(v) and target in str(v).strip().lower()]
        if hit_cols:
            j0 = hit_cols[0]
            for k in range(j0 + 1, raw.shape[1]):
                v = row.iloc[k]
                if pd.notna(v) and str(v).strip():
                    return str(v).strip()
            for k in range(0, raw.shape[1]):
                v = row.iloc[k]
                if k != j0 and pd.notna(v) and str(v).strip():
                    return str(v).strip()
    return pd.NA


def _extract_metadata(raw):
    """Extract metadata rows consistently from the top of the sheet."""
    return {
        "data_extracted_on": (
            str(raw.iloc[0, 0]).replace("Data extracted on ", "").strip()
            if raw.shape[0] > 0 and pd.notna(raw.iloc[0, 0]) else pd.NA
        ),
        "dataset": _meta_value(raw, "Dataset"),
        "last_updated": _meta_value(raw, "Last updated"),
        "time_frequency": _meta_value(raw, "Time frequency"),
        "size_class": _meta_value(raw, "Size classes in number of persons employed"),
        "nace_rev2": _meta_value(raw, "Statistical classification of economic activities"),
        "information_society_indicator": _meta_value(raw, "Information society indicator"),
        "unit_of_measure": _meta_value(raw, "Unit of measure"),
    }


# ---------------------------------------------------------
# Detect and read one sheet with two-row header (TIME + GEO)
# ---------------------------------------------------------
def _read_sheet_tidy(xls, sheet_name):
    """Reads one Eurostat sheet correctly, replacing all missing values with pd.NA."""
    raw = pd.read_excel(xls, sheet_name=sheet_name, header=None, dtype=str)
    raw = raw.replace({r"^\s*$": pd.NA}, regex=True)

    # --- Find the header start (TIME row + GEO row) ---
    time_row = None
    for i in range(0, min(40, raw.shape[0] - 1)):
        row_i = [str(v).strip().upper() if pd.notna(v) else "" for v in raw.iloc[i].tolist()]
        row_ip1 = [str(v).strip().upper() if pd.notna(v) else "" for v in raw.iloc[i + 1].tolist()]
        if "TIME" in row_i and any("GEO (LABELS)" in c for c in row_ip1):
            time_row = i
            break

    if time_row is None:
        return pd.DataFrame(), f"No TIME/GEO header pattern found in {sheet_name}"

    # --- Read with the two header rows ---
    df = pd.read_excel(xls, sheet_name=sheet_name, header=[time_row, time_row + 1], dtype=str)
    df = df.replace({":": pd.NA, "": pd.NA, " ": pd.NA, "<N.A>": pd.NA})

    # --- Identify key columns ---
    country_col = None
    year_cols = []
    for col in df.columns:
        top = str(col[0]).strip() if isinstance(col, tuple) else str(col).strip()
        bottom = str(col[1]).strip() if isinstance(col, tuple) else ""
        if bottom.upper() == "GEO (LABELS)":
            country_col = col
        if re.fullmatch(r"\d{4}", top):
            year_cols.append(col)

    if country_col is None:
        for col in df.columns:
            top = str(col[0]).strip() if isinstance(col, tuple) else str(col).strip()
            if top.upper() == "GEO (LABELS)":
                country_col = col
                break
    if country_col is None:
        country_col = df.columns[0]

    if not year_cols:
        for col in df.columns:
            top = str(col[0]).strip() if isinstance(col, tuple) else str(col).strip()
            if re.search(r"\b\d{4}\b", top):
                year_cols.append(col)

    if not year_cols:
        return pd.DataFrame(), f"No year columns found in {sheet_name}"

    # --- Build simplified wide DataFrame ---
    wide = pd.DataFrame()
    wide["country_name"] = df[country_col]
    for yc in year_cols:
        top = str(yc[0]).strip() if isinstance(yc, tuple) else str(yc).strip()
        try:
            year = str(int(float(top)))
        except Exception:
            year = top
        wide[year] = df[yc]

    # --- Melt to tidy long format ---
    value_cols = [c for c in wide.columns if re.fullmatch(r"\d{4}", str(c))]
    tidy = wide.melt(id_vars=["country_name"], value_vars=value_cols,
                     var_name="year", value_name="value")

    # --- Metadata ---
    meta = _extract_metadata(raw)
    for k, v in meta.items():
        tidy[k] = v
    tidy["sheet_name"] = sheet_name

    # --- Clean and convert types ---
    tidy = tidy.replace({None: pd.NA, "": pd.NA, " ": pd.NA, "<N.A>": pd.NA})
    tidy["year"] = pd.to_numeric(tidy["year"], errors="coerce").astype("Int64")
    tidy["value"] = pd.to_numeric(tidy["value"], errors="coerce").astype("Float64")
    tidy = tidy.convert_dtypes()
    return tidy, None


# ---------------------------------------------------------
# Process a workbook (multiple sheets)
# ---------------------------------------------------------
def process_workbook(file_path):
    print(f"\nProcessing: {file_path}")
    xls = pd.ExcelFile(file_path)
    data_sheets = [s for s in xls.sheet_names if not s.lower().startswith(("summary", "structure", "flags"))]

    frames = []
    for s in data_sheets:
        df, err = _read_sheet_tidy(xls, s)
        if err:
            print(f"  Skipped {s}: {err}")
            continue
        frames.append(df)
        print(f"  Processed {s} ({df.shape[0]} rows)")

    if not frames:
        raise ValueError(f"No usable sheets found in {file_path}")

    combined = pd.concat(frames, ignore_index=True).convert_dtypes()
    combined = combined.replace({None: pd.NA, "": pd.NA, " ": pd.NA, "<N.A>": pd.NA})

    out_csv = Path(file_path).stem + "_combined.csv"
    combined.to_csv(out_csv, index=False, na_rep="")
    print(f"Saved → {out_csv}  ({combined.shape[0]} rows, {combined.shape[1]} cols)")
    return combined


# ---------------------------------------------------------
# Normalize to 3NF
# ---------------------------------------------------------
def normalize_to_3nf(df):
    df = df.convert_dtypes().replace({None: pd.NA, "": pd.NA, " ": pd.NA, "<N.A>": pd.NA})

    countries = (
        df[["country_name"]]
        .drop_duplicates()
        .reset_index(drop=True)
        .convert_dtypes()
    )
    countries["country_id"] = countries.index + 1

    indicators = (
        df[["information_society_indicator", "unit_of_measure", "nace_rev2", "size_class", "time_frequency"]]
        .drop_duplicates()
        .reset_index(drop=True)
        .convert_dtypes()
    )
    indicators["indicator_id"] = indicators.index + 1

    observations = (
        df.merge(countries, on="country_name", how="left")
          .merge(
              indicators,
              on=["information_society_indicator", "unit_of_measure", "nace_rev2", "size_class", "time_frequency"],
              how="left"
          )[[
              "country_id", "indicator_id", "year", "value",
              "dataset", "last_updated", "data_extracted_on", "sheet_name"
          ]]
          .convert_dtypes()
    )

    # --- Save to CSVs ---
    countries.to_csv("countries.csv", index=False, na_rep="")
    indicators.to_csv("indicators.csv", index=False, na_rep="")
    observations.to_csv("observations.csv", index=False, na_rep="")

    print("\n3NF tables saved:")
    print("  countries.csv")
    print("  indicators.csv")
    print("  observations.csv")
    return countries, indicators, observations


# ---------------------------------------------------------
# Main
# ---------------------------------------------------------
if __name__ == "__main__":
    files = [
        "isoc_r_eb_ain2$defaultview_spreadsheet.xlsx",
        "isoc_eb_ain2$defaultview_spreadsheet.xlsx",
        "isoc_eb_ai$defaultview_spreadsheet.xlsx",
    ]

    all_frames = []
    for f in files:
        df = process_workbook(f)
        all_frames.append(df)

    combined_all = pd.concat(all_frames, ignore_index=True).convert_dtypes()
    combined_all = combined_all.replace({None: pd.NA, "": pd.NA, " ": pd.NA, "<N.A>": pd.NA})
    combined_all.to_csv("all_eurostat_combined.csv", index=False, na_rep="")
    print("\nSaved → all_eurostat_combined.csv  "
          f"({combined_all.shape[0]} rows, {combined_all.shape[1]} cols)")

    normalize_to_3nf(combined_all)
