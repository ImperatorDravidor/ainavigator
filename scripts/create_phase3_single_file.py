"""
Create a single JSON file for Phase 3 upload
Contains both sentiment and capability data in one package
"""

import pandas as pd
import numpy as np
import json
from pathlib import Path

np.random.seed(42)

def main():
    print("📦 Creating Phase 3 single upload file...")
    
    # Load baseline
    data_dir = Path(__file__).parent.parent / 'data' / 'csv-imports'
    sentiment_df = pd.read_csv(data_dir / 'sentiment_realistic.csv')
    capability_df = pd.read_csv(data_dir / 'capability_demo.csv')
    
    print(f"   Loaded {len(sentiment_df)} sentiment + {len(capability_df)} capability records")
    
    # Apply Phase 3 improvements (cumulative: 21% from P2 + 35% more = 56% total)
    print("📈 Applying Phase 3 improvements...")
    
    # Sentiment: 56% total improvement from baseline
    sentiment_p3 = []
    for _, row in sentiment_df.iterrows():
        record = {}
        # Copy demographics
        id_col = 'respondent_id' if 'respondent_id' in row else 'RespondentID'
        record['respondent_id'] = f"P3_{row.get(id_col, row.name)}"
        record['region'] = row.get('region') or row.get('Region', 'Unknown')
        record['department'] = row.get('department') or row.get('Department', 'Unknown')
        record['employment_type'] = row.get('employment_type') or row.get('EmploymentType', 'Full-time')
        record['age'] = row.get('age') or row.get('Age', '30-39')
        record['user_language'] = row.get('user_language') or row.get('UserLanguage', 'en')
        record['industry'] = row.get('industry') or row.get('Industry', 'Financial Services')
        record['continent'] = row.get('continent') or row.get('Continent', 'North America')
        
        # Apply Phase 3: REDUCE resistance across all areas (lower = better)
        # 50% reduction from baseline = transformation
        for i in range(1, 26):
            key = f'sentiment_{i}'
            if pd.notna(row.get(key)):
                record[key] = max(float(row[key]) * 0.50, 1.0) # Cut resistance in half, min 1.0
        
        sentiment_p3.append(record)
    
    # Capability: Strong improvements across all dimensions (higher = better)
    capability_p3 = []
    for _, row in capability_df.iterrows():
        id_col = 'ResponseId_id' if 'ResponseId_id' in row else 'respondent_id'
        dim = int(row['dimension_id'])
        
        # Phase 3 improvements by dimension
        multiplier = 1.25  # Default 25% improvement
        if dim in [1, 8]:  # Strategy, Ethics - major focus
            multiplier = 1.35
        elif dim in [4, 6, 7]:  # Talent, Innovation, Adoption
            multiplier = 1.30
        
        capability_p3.append({
            'respondent_id': f"P3_{row.get(id_col, row.name)}",
            'dimension_id': dim,
            'dimension': row['dimension'],
            'construct_id': int(row['construct_id']),
            'construct': row['construct'],
            'score': min(float(row['score']) * multiplier, 7.0), # Max 7.0
            'industry_synthetic': row.get('industry_synthetic', 'Financial Services'),
            'country_synthetic': row.get('country_synthetic', 'USA'),
            'continent_synthetic': row.get('continent_synthetic', 'North America'),
            'role_synthetic': row.get('role_synthetic', 'Analyst')
        })
    
    # Create combined package
    phase3_package = {
        'metadata': {
            'phase': 3,
            'name': 'Nov 2025 - Phase 3',
            'assessment_date': '2025-11-15',
            'description': 'Complete transformation after all 6 interventions',
            'interventions_applied': ['A1', 'A3', 'B2', 'B3', 'C1', 'C2'],
            'improvements_from_baseline': {
                'sentiment': '-50% resistance (major improvement)',
                'capability': '+25-35% maturity'
            }
        },
        'sentiment_data': sentiment_p3,
        'capability_data': capability_p3
    }
    
    # Save
    output_path = data_dir / 'journey' / 'phase3_upload.json'
    with open(output_path, 'w') as f:
        json.dump(phase3_package, f, indent=2)
    
    print(f"✅ Created: {output_path}")
    print(f"📊 Contains:")
    print(f"   - {len(sentiment_p3)} sentiment records")
    print(f"   - {len(capability_p3)} capability scores")
    print(f"   - Metadata with interventions & improvements")
    print(f"\n🎯 Upload this single file for Phase 3!")

if __name__ == '__main__':
    main()

