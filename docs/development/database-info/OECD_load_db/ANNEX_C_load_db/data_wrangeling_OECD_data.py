# -*- coding: utf-8 -*-
"""
Created on Thu Oct 16 10:13:57 2025

@author: baroc
"""

import pandas as pd
import re

def parse_oecd_csv_3nf(input_path: str, output_dir: str = None):
    """
    Parses a raw OECD survey CSV (from Tabula or OCR) into a structured,
    relational 3NF format: Section, Question, and Option tables.

    Parameters
    ----------
    input_path : str
        Path to the raw CSV file.
    output_dir : str, optional
        Directory where output CSVs will be saved (section.csv, question.csv, option.csv).
        If not provided, files are not written to disk.

    Returns
    -------
    tuple of pd.DataFrame
        (df_section, df_question, df_option)
    """

    # Step 1. Load all raw lines
    with open(input_path, "r", encoding="utf-8", errors="ignore") as f:
        lines = [line.strip().strip(',') for line in f.readlines() if line.strip()]

    # Step 2. Initialize variables
    records = []
    current_section = None
    current_q = None
    question_text = None
    sc_counter = 0

    # Step 3. Parse and group
    for line in lines:
        # Detect section headers (e.g. "Screening questions")
        if re.match(r"^[A-Z].*questions", line, re.IGNORECASE):
            current_section = line.strip(",").strip()
            continue

        # Detect new question (not starting with a bullet)
        if not line.startswith("•"):
            sc_counter += 1
            current_q = f"SC{sc_counter}"
            question_text = line.strip(",").strip()
            continue

        # Detect options
        elif line.startswith("•") and question_text:
            option_text = line.lstrip("• ").strip(",").strip()
            records.append([current_q, current_section, question_text, option_text])

    # Step 4. Build flat table
    df_clean = pd.DataFrame(records, columns=["SC_ID", "Section", "QuestionText", "OptionText"])

    # Step 5. 3NF normalization

    # SECTION TABLE
    df_section = df_clean[["Section"]].drop_duplicates().reset_index(drop=True)
    df_section["SectionID"] = [f"SEC{i+1}" for i in range(len(df_section))]

    # QUESTION TABLE
    df_question = df_clean[["SC_ID", "Section", "QuestionText"]].drop_duplicates()
    df_question = df_question.merge(df_section, on="Section", how="left")[["SC_ID", "SectionID", "QuestionText"]]
    df_question = df_question.rename(columns={"SC_ID": "QuestionID"})

    # OPTION TABLE
    df_option = df_clean.copy()
    df_option["OptionID"] = df_option.groupby("SC_ID").cumcount() + 1
    df_option["OptionID"] = df_option["SC_ID"] + "_" + df_option["OptionID"].astype(str)
    df_option = df_option[["OptionID", "SC_ID", "OptionText"]].rename(columns={"SC_ID": "QuestionID"})

    # Step 6. Optionally save to CSVs
    if output_dir:
        df_section.to_csv(f"{output_dir}/section.csv", index=False)
        df_question.to_csv(f"{output_dir}/question.csv", index=False)
        df_option.to_csv(f"{output_dir}/option.csv", index=False)

    return df_section, df_question, df_option


# Example usage
df_section, df_question, df_option = parse_oecd_csv_3nf("OECD data.csv")

df_section.to_csv("section.csv", index=False)
df_question.to_csv("question.csv", index=False)
df_option.to_csv("option.csv", index=False)



import pandas as pd
import re

def parse_oecd_survey_csv_3nf(input_path):
    # Step 1. Load all columns (Tabula sometimes splits cells)
    df = pd.read_csv(input_path, header=None, engine="python", on_bad_lines="skip")

    # Step 2. Merge columns into one unified text column
    df["merged"] = df.fillna("").astype(str).apply(lambda x: " ".join(x).strip(), axis=1)
    lines = [line.strip() for line in df["merged"].tolist() if line.strip()]

    records = []
    qnum, qtext, resp_type = None, None, None
    current_options = []

    for i, line in enumerate(lines):
        # Detect question start
        q_match = re.match(r"Question\s*(\d+)", line, re.IGNORECASE)
        if q_match:
            # Save previous question’s options before starting a new one
            if qnum and current_options:
                for opt in current_options:
                    records.append([f"Q{qnum}", qtext, opt, resp_type])

            # Reset for new question
            current_options = []
            qnum = q_match.group(1)

            # Extract question text
            possible_text = line
            if i + 1 < len(lines):
                possible_text += " " + lines[i + 1]
            qtext_match = re.search(r"Question\s*\d+\.\s*(.*)", possible_text)
            qtext = qtext_match.group(1).strip() if qtext_match else possible_text.strip()

            # Detect Yes/No/Don't know patterns
            if re.search(r"Yes\s*No\s*Don.?t\s*know", possible_text, re.IGNORECASE):
                resp_type = "Yes / No / Don't know"
            elif re.search(r"Yes\s*No", possible_text, re.IGNORECASE):
                resp_type = "Yes / No"
            else:
                resp_type = "Multiple choice"

            continue  # move to next line after detecting question

        # Collect options if inside a question
        if qnum:
            # Skip repeated headers or blank filler
            if re.match(r"Question\s*\d+", line, re.IGNORECASE):
                continue
            if re.search(r"Yes\s*No|Don.?t\s*know", line, re.IGNORECASE):
                continue
            if len(line) <= 2:
                continue
            # Add option
            current_options.append(line.strip("• ").strip())

    # Save the final question block
    if qnum and current_options:
        for opt in current_options:
            records.append([f"Q{qnum}", qtext, opt, resp_type])

    # Step 3. Build the clean DataFrame
    df_clean = pd.DataFrame(records, columns=["QuestionID", "QuestionText", "OptionText", "ResponseType"])
    df_clean["QuestionID"] = df_clean["QuestionID"].str.replace("Question", "Q").str.strip()
    df_clean = df_clean.drop_duplicates().reset_index(drop=True)

    # Step 4. Export
    df_clean.to_csv("OECD_survey_cleaned.csv", index=False)
    print(f" Extracted {df_clean['QuestionID'].nunique()} questions and {len(df_clean)} rows.")
    return df_clean


# ---- Run ----
df_clean = parse_oecd_survey_csv_3nf("tabula-OECD data.csv")



import hashlib

def normalize_to_3nf(input_csv):
    # Step 1. Load cleaned survey file
    df = pd.read_csv(input_csv)
    
    # Step 2. Create Section Table (only one section here)
    df_section = pd.DataFrame([["S1", "OECD Survey Questions"]], columns=["SectionID", "SectionName"])
    
    # Step 3. Create Question Table
    df_question = (
        df[["QuestionID", "QuestionText", "ResponseType"]]
        .drop_duplicates()
        .assign(SectionID="S1")
        .loc[:, ["QuestionID", "SectionID", "QuestionText", "ResponseType"]]
        .reset_index(drop=True)
    )
    
    # Step 4. Create Option Table
    df_option = (
        df[["QuestionID", "OptionText"]]
        .drop_duplicates()
        .reset_index(drop=True)
    )

    # Generate unique OptionIDs using hash for stability
    df_option["OptionID"] = df_option.apply(
        lambda x: "O" + hashlib.md5(f"{x.QuestionID}_{x.OptionText}".encode()).hexdigest()[:6],
        axis=1
    )

    df_option = df_option.loc[:, ["OptionID", "QuestionID", "OptionText"]]

    # Step 5. Save CSVs
    df_section.to_csv("section.csv", index=False)
    df_question.to_csv("question.csv", index=False)
    df_option.to_csv("option.csv", index=False)

    print("3NF tables created and saved:")
    print(f" - {len(df_section)} sections")
    print(f" - {len(df_question)} questions")
    print(f" - {len(df_option)} options")

    return df_section, df_question, df_option


# ---- Run ----
df_section, df_question, df_option = normalize_to_3nf("OECD_survey_cleaned.csv")


