#!/usr/bin/env python3
"""
Import Interventions Data from Excel and Word Documents

Implements AINAV-10: BIG ONE - NEW INTERVENTIONS
- Loads intervention data from Excel file
- Extracts descriptions from Word documents
- Populates intervention tables in Supabase

Usage:
    python3 scripts/import_interventions.py
"""

import os
import sys
import pandas as pd
from supabase import create_client, Client
from docx import Document
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: SUPABASE_URL and SUPABASE_KEY environment variables required")
    sys.exit(1)

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# File paths
EXCEL_FILE = 'docs/archive/intervention-source-docs/0 - Overview of interventions per area.xlsx'
INTERVENTIONS_DIR = 'docs/archive/intervention-source-docs'

def extract_word_description(code: str) -> str:
    """Extract description from Word document for given intervention code."""
    # Map code to file name pattern
    file_mapping = {
        'A1': 'A1 - AI Roadmap Pressure Cooker.docx',
        'A2': 'A2 - AI Dialectics Sessions.docx',
        'A3': 'A3 - AI Adoption Playbook Co-Design.docx',
        'B1': 'B1 - Adoption Challenge.docx',
        'B2': 'B2 - AI Learning Week.docx',
        'B3': 'B3 - The Road to AI Adoption.docx',
        'B4': 'B4 - AI Ambassadors Network.docx',
        'B5': 'B5 - Playful Nudging Toolkit.docx',
        'C1': 'C1 - Kickstart with AI.docx',
        'C2': 'C2 - ROI Retrospective Workshop.docx',
    }

    filename = file_mapping.get(code)
    if not filename:
        return ""

    filepath = os.path.join(INTERVENTIONS_DIR, filename)
    if not os.path.exists(filepath):
        print(f"⚠️  Warning: Word file not found for {code}: {filepath}")
        return ""

    try:
        doc = Document(filepath)
        # Extract all paragraph text
        paragraphs = [para.text.strip() for para in doc.paragraphs if para.text.strip()]
        description = '\n\n'.join(paragraphs)
        return description
    except Exception as e:
        print(f"⚠️  Warning: Could not read Word file for {code}: {e}")
        return ""

def parse_intervention_code(text: str) -> str:
    """Extract intervention code from text like 'B1 - Adoption Challenge'."""
    if not text or not isinstance(text, str):
        return ""
    parts = text.split(' - ')
    if len(parts) >= 1:
        return parts[0].strip()
    return text.strip()

def map_sentiment_category_to_id(category_text: str) -> int:
    """Map sentiment category text to category ID (1-5)."""
    # Categories from sentiment-metadata.ts
    mapping = {
        'AI is too Autonomous': 1,
        'AI is too Inflexible': 2,
        'AI is Emotionless': 3,
        'AI is too Opaque': 4,
        'People Prefer Human Interaction': 5,
    }
    return mapping.get(category_text, 0)

def map_sentiment_level_to_id(level_text: str) -> int:
    """Map sentiment level text to level ID (1-5)."""
    # Levels from sentiment-metadata.ts and Excel variations
    mapping = {
        '1 - Personal Workflow Preferences': 1,
        '2 - Collaboration & Role Adjustments': 2,
        '3 - Professional Trust & Fairness Issues': 3,
        '3 - Trust & Fairness Issues': 3,  # Excel variation
        '4 - Career Security & Job Redefinition Anxiety': 4,
        '4 - Career Security & Job Redefinition': 4,  # Excel variation
        '5 - Organizational Stability at Risk': 5,
        '5 - Organisational Stability at Risk': 5,  # Excel variation (British spelling)
    }
    return mapping.get(level_text, 0)

def import_interventions():
    """Import master list of interventions."""
    print("\n" + "="*80)
    print("📋 Step 1: Importing Interventions")
    print("="*80)

    df = pd.read_excel(EXCEL_FILE, sheet_name='List of interventions')

    interventions = []
    for _, row in df.iterrows():
        code = row['Code']
        description = extract_word_description(code)

        intervention = {
            'code': code,
            'name': row['Intervention Name'],
            'level': row['Level'],
            'core_function': row['Core Function'],
            'description': description
        }
        interventions.append(intervention)
        print(f"  ✓ {code}: {row['Intervention Name'][:60]}...")

    # Insert into database
    try:
        result = supabase.table('interventions').upsert(interventions, on_conflict='code').execute()
        print(f"\n✅ Inserted {len(interventions)} interventions")
        return True
    except Exception as e:
        print(f"\n❌ Error inserting interventions: {e}")
        return False

def import_sentiment_mappings():
    """Import sentiment heatmap cell → intervention mappings."""
    print("\n" + "="*80)
    print("📊 Step 2: Importing Sentiment Heatmap Mappings (25 cells)")
    print("="*80)

    df = pd.read_excel(EXCEL_FILE, sheet_name='Interventions Sentiment Cat')

    mappings = []
    for _, row in df.iterrows():
        level_id = map_sentiment_level_to_id(row['Level'])
        category_id = map_sentiment_category_to_id(row['Reason'])

        if level_id == 0 or category_id == 0:
            print(f"⚠️  Warning: Could not map Level='{row['Level']}' or Reason='{row['Reason']}'")
            continue

        mapping = {
            'category': row['Category'],
            'reason': row['Reason'],
            'level_name': row['Level'],
            'level_id': level_id,
            'category_id': category_id,
            'primary_intervention_code': parse_intervention_code(row['Primary Intervention']),
            'secondary_intervention_code': parse_intervention_code(row['Secondary Intervention']),
            'tertiary_intervention_code': parse_intervention_code(row['Tertiary Intervention']),
        }
        mappings.append(mapping)
        print(f"  ✓ L{level_id}×C{category_id}: {mapping['primary_intervention_code']}, {mapping['secondary_intervention_code']}, {mapping['tertiary_intervention_code']}")

    # Insert into database
    try:
        result = supabase.table('intervention_sentiment_mappings').upsert(
            mappings,
            on_conflict='level_id,category_id'
        ).execute()
        print(f"\n✅ Inserted {len(mappings)} sentiment mappings")
        return True
    except Exception as e:
        print(f"\n❌ Error inserting sentiment mappings: {e}")
        return False

def import_capability_mappings():
    """Import capability dimension → intervention mappings."""
    print("\n" + "="*80)
    print("🔷 Step 3: Importing Capability Dimension Mappings (8 dimensions)")
    print("="*80)

    df = pd.read_excel(EXCEL_FILE, sheet_name='Interventions capability dim')

    mappings = []
    for idx, row in df.iterrows():
        dimension_id = idx + 1  # 1-8

        mapping = {
            'dimension_id': dimension_id,
            'dimension_name': row['Capability Dimension'],
            'primary_intervention_code': parse_intervention_code(row['Primary Intervention']),
            'secondary_intervention_code': parse_intervention_code(row['Secondary Intervention']),
            'tertiary_intervention_code': parse_intervention_code(row['Tertiary Intervention']),
            'rationale': row['Rationale (Mechanism of Change)']
        }
        mappings.append(mapping)
        print(f"  ✓ Dimension {dimension_id}: {mapping['dimension_name'][:50]}...")
        print(f"    → {mapping['primary_intervention_code']}, {mapping['secondary_intervention_code']}, {mapping['tertiary_intervention_code']}")

    # Insert into database
    try:
        result = supabase.table('intervention_capability_mappings').upsert(
            mappings,
            on_conflict='dimension_id'
        ).execute()
        print(f"\n✅ Inserted {len(mappings)} capability mappings")
        return True
    except Exception as e:
        print(f"\n❌ Error inserting capability mappings: {e}")
        return False

def import_next_steps():
    """Import intervention → next steps progression logic."""
    print("\n" + "="*80)
    print("➡️  Step 4: Importing Next Steps / Progression Logic (10 interventions)")
    print("="*80)

    df = pd.read_excel(EXCEL_FILE, sheet_name='Follow up interventions')

    next_steps = []
    for _, row in df.iterrows():
        intervention_code = parse_intervention_code(row['Intervention'])

        next_step = {
            'intervention_code': intervention_code,
            'primary_next_code': parse_intervention_code(row['Primary Next Intervention']),
            'secondary_next_code': parse_intervention_code(row['Secondary Next Intervention']),
            'tertiary_next_code': parse_intervention_code(row['Tertiary Next Intervention']),
            'rationale': row['Rationale (Progression Logic)']
        }
        next_steps.append(next_step)
        print(f"  ✓ {intervention_code} → {next_step['primary_next_code']}, {next_step['secondary_next_code']}, {next_step['tertiary_next_code']}")

    # Insert into database
    try:
        result = supabase.table('intervention_next_steps').upsert(
            next_steps,
            on_conflict='intervention_code'
        ).execute()
        print(f"\n✅ Inserted {len(next_steps)} next step mappings")
        return True
    except Exception as e:
        print(f"\n❌ Error inserting next steps: {e}")
        return False

def verify_import():
    """Verify all data was imported correctly."""
    print("\n" + "="*80)
    print("🔍 Step 5: Verification")
    print("="*80)

    # Count records in each table
    try:
        interventions_count = len(supabase.table('interventions').select('code').execute().data)
        sentiment_count = len(supabase.table('intervention_sentiment_mappings').select('id').execute().data)
        capability_count = len(supabase.table('intervention_capability_mappings').select('id').execute().data)
        next_steps_count = len(supabase.table('intervention_next_steps').select('id').execute().data)

        print(f"  📋 Interventions: {interventions_count} (expected: 10)")
        print(f"  📊 Sentiment mappings: {sentiment_count} (expected: 25)")
        print(f"  🔷 Capability mappings: {capability_count} (expected: 8)")
        print(f"  ➡️  Next steps: {next_steps_count} (expected: 10)")

        all_correct = (
            interventions_count == 10 and
            sentiment_count == 25 and
            capability_count == 8 and
            next_steps_count == 10
        )

        if all_correct:
            print("\n✅ ALL VERIFICATION CHECKS PASSED!")
            return True
        else:
            print("\n⚠️  Some counts don't match expected values")
            return False

    except Exception as e:
        print(f"\n❌ Verification error: {e}")
        return False

def main():
    """Main import workflow."""
    print("\n" + "="*80)
    print("🚀 INTERVENTION DATA IMPORT")
    print("="*80)
    print(f"Source: {EXCEL_FILE}")
    print(f"Descriptions: {INTERVENTIONS_DIR}/*.docx")
    print(f"Database: {SUPABASE_URL}")

    # Install python-docx if needed
    try:
        import docx
    except ImportError:
        print("\n📦 Installing python-docx for Word document parsing...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "python-docx"])
        print("✅ python-docx installed")

    # Run import steps
    success = True
    success = import_interventions() and success
    success = import_sentiment_mappings() and success
    success = import_capability_mappings() and success
    success = import_next_steps() and success
    success = verify_import() and success

    if success:
        print("\n" + "="*80)
        print("🎉 INTERVENTION DATA IMPORT COMPLETE!")
        print("="*80)
        print("\n📊 Summary:")
        print("  - 10 interventions across 3 levels (Strategy, Adoption, Innovation)")
        print("  - 25 sentiment heatmap cell mappings (5×5 grid)")
        print("  - 8 capability dimension mappings")
        print("  - 10 next-step progression workflows")
        print("\n✅ Ready for AINAV-10: Intervention clickability and detail views")
        return 0
    else:
        print("\n❌ Import completed with errors")
        return 1

if __name__ == '__main__':
    sys.exit(main())
