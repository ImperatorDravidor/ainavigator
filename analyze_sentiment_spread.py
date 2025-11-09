#!/usr/bin/env python3
"""
Analyze sentiment data spread and fix if too narrow
"""

import pandas as pd
import numpy as np

# Read demo data if it exists
data_paths = [
    'data/data-foundation/sentiment_demo.csv',
    'public/demo_data/sample_sentiment.csv',
    'data/csv-imports/sentiment_demo.csv'
]

for path in data_paths:
    try:
        df = pd.read_csv(path)
        print(f"\n✓ Found: {path}")
        print(f"Rows: {len(df)}")
        print(f"Columns: {list(df.columns)[:10]}...")
        
        # Check for sentiment columns
        sentiment_cols = [col for col in df.columns if 'sentiment' in col.lower() or col.startswith('Sentiment')]
        
        if sentiment_cols:
            print(f"\nSentiment columns: {len(sentiment_cols)}")
            print("\nCurrent distribution (first 5 sentiment columns):")
            for col in sentiment_cols[:5]:
                values = df[col].dropna()
                if len(values) > 0:
                    print(f"{col}:")
                    print(f"  Min: {values.min():.2f}")
                    print(f"  Max: {values.max():.2f}")
                    print(f"  Mean: {values.mean():.2f}")
                    print(f"  Std: {values.std():.2f}")
                    print(f"  Range: {values.max() - values.min():.2f}")
            
            # Check if data needs more spread
            all_sentiment_values = df[sentiment_cols].values.flatten()
            all_sentiment_values = all_sentiment_values[~np.isnan(all_sentiment_values)]
            
            overall_std = np.std(all_sentiment_values)
            overall_range = np.max(all_sentiment_values) - np.min(all_sentiment_values)
            
            print(f"\nOverall sentiment statistics:")
            print(f"  Range: {overall_range:.2f}")
            print(f"  Std Dev: {overall_std:.2f}")
            
            if overall_std < 0.3 or overall_range < 1.0:
                print(f"\n⚠️  WARNING: Data has very little spread!")
                print(f"   Range of {overall_range:.2f} and StdDev of {overall_std:.2f} is too narrow")
                print(f"   Scores should span 1.0-3.0 with meaningful variation")
                print(f"\n   Recommendation: Generate new demo data with:")
                print(f"   - Some cells around 1.2-1.5 (low resistance)")
                print(f"   - Some cells around 2.0-2.5 (medium resistance)")  
                print(f"   - Some cells around 2.7-3.0 (high resistance)")
            else:
                print(f"\n✓ Data has reasonable spread")
                
        break
    except FileNotFoundError:
        continue
    except Exception as e:
        print(f"Error reading {path}: {e}")
        continue
else:
    print("❌ No sentiment data files found")

