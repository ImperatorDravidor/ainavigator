#!/usr/bin/env python3
"""
Generate realistic sentiment demo data with proper variation
Creates data where different cells have meaningfully different scores
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta

np.random.seed(42)

# Configuration
num_respondents = 500
regions = ['North America', 'Europe', 'Asia Pacific']
departments = ['Engineering', 'Product', 'Sales', 'Marketing', 'Operations', 'HR', 'Finance']
employment_types = ['<3 year', '3-10 year', '10-20 year', '>20 year']
ages = ['<25', '25-35', '35-45', '45-55', '55+']

respondents = []

for i in range(num_respondents):
    respondent = {
        'respondent_id': f'RESP_{i+1:04d}',
        'region': np.random.choice(regions),
        'department': np.random.choice(departments),
        'employment_type': np.random.choice(employment_types),
        'age': np.random.choice(ages),
        'user_language': 'EN'
    }
    
    # Generate sentiment scores with realistic patterns
    # Scale: 1.0 (low resistance/positive) to 3.0 (high resistance/negative)
    
    # Create different patterns for different cells to ensure spread:
    # - Some cells (personal workflow issues) tend to score higher (more resistance): 2.0-2.8
    # - Some cells (organizational) tend to score lower (less resistance): 1.2-1.8
    # - Some in the middle: 1.6-2.4
    
    sentiment_scores = []
    
    for cell_num in range(1, 26):
        # Create variation based on cell position
        level = ((cell_num - 1) // 5) + 1  # Which level (1-5)
        category = ((cell_num - 1) % 5) + 1  # Which category (1-5)
        
        # Pattern: Personal/Collaboration (L1-L2) have higher resistance
        #          Career/Org (L4-L5) have varied resistance 
        #          Trust (L3) is mixed
        
        if level <= 2:  # Personal & Collaboration
            # Higher resistance (2.0-2.9 with some outliers)
            base_mean = 2.3
            std = 0.35
        elif level == 3:  # Trust & Fairness
            # Mixed resistance (1.5-2.6)
            base_mean = 2.0
            std = 0.4
        elif level == 4:  # Career Security
            # Variable by category
            if category in [1, 4]:  # Autonomy & Opaque = high concern
                base_mean = 2.4
                std = 0.3
            else:
                base_mean = 1.8
                std = 0.35
        else:  # Org Stability (L5)
            # Lower overall resistance but some hotspots
            if category == 4:  # Opaque = major concern
                base_mean = 2.5
                std = 0.3
            else:
                base_mean = 1.6
                std = 0.4
        
        # Add category-specific adjustments
        if category == 3:  # Emotionless - often lower concern
            base_mean -= 0.2
        elif category == 4:  # Opaque - often higher concern
            base_mean += 0.2
        
        # Generate score with variation
        score = np.random.normal(base_mean, std)
        # Clamp to 1.0-3.0 range
        score = np.clip(score, 1.0, 3.0)
        # Round to 1 decimal
        score = round(score, 1)
        
        sentiment_scores.append(score)
    
    # Assign scores to columns (sentiment_1 through sentiment_25)
    for idx, score in enumerate(sentiment_scores, 1):
        respondent[f'sentiment_{idx}'] = score
    
    respondents.append(respondent)

# Create DataFrame
df = pd.DataFrame(respondents)

# Save to CSV
output_path = 'data/csv-imports/sentiment_realistic.csv'
df.to_csv(output_path, index=False)

print(f"✓ Generated {num_respondents} respondents with realistic sentiment variation")
print(f"✓ Saved to: {output_path}")

# Show statistics
print("\n=== Sample Statistics ===")
for col in ['sentiment_1', 'sentiment_5', 'sentiment_15', 'sentiment_20', 'sentiment_24']:
    print(f"\n{col}:")
    print(f"  Min: {df[col].min():.1f}")
    print(f"  Max: {df[col].max():.1f}")
    print(f"  Mean: {df[col].mean():.2f}")
    print(f"  Std: {df[col].std():.2f}")
    print(f"  Range: {df[col].max() - df[col].min():.1f}")

print("\n=== Overall Variation ===")
all_scores = df[[f'sentiment_{i}' for i in range(1, 26)]].values.flatten()
print(f"Overall Mean: {np.mean(all_scores):.2f}")
print(f"Overall Std: {np.std(all_scores):.2f}")
print(f"Overall Range: {np.max(all_scores) - np.min(all_scores):.1f}")
print("\nThis should create meaningful color variation in the heatmap!")

