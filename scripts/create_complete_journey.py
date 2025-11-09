"""
Create Complete 3-Phase Assessment Journey
Demonstrates progressive improvement from baseline through two intervention cycles
"""

import pandas as pd
import numpy as np
from pathlib import Path
import json
from datetime import datetime

# Set random seed for reproducibility
np.random.seed(42)

class JourneyGenerator:
    def __init__(self, baseline_path):
        self.data_dir = Path(baseline_path)
        self.output_dir = self.data_dir / 'journey'
        self.output_dir.mkdir(exist_ok=True)
        
    def load_baseline(self):
        """Load the original Oct 2024 baseline data"""
        print("📊 Loading Oct 2024 baseline data...")
        sentiment_df = pd.read_csv(self.data_dir / 'sentiment_realistic.csv')
        capability_df = pd.read_csv(self.data_dir / 'capability_demo.csv')
        
        print(f"   ✓ {len(sentiment_df)} sentiment responses")
        print(f"   ✓ {len(capability_df)} capability scores")
        
        return sentiment_df, capability_df
    
    def create_phase2_march2025(self, sentiment_base, capability_base):
        """
        Phase 2: March 2025 - After implementing A1, B2, C1
        
        Interventions:
        - A1: AI Strategy & Governance Framework
        - B2: AI Literacy & Training Program  
        - C1: Innovation Labs & Experimentation
        
        Expected improvements:
        - Sentiment Q21-25 (Org Stability): +0.4 to +0.6
        - Sentiment Q6-10 (Collaboration): +0.3 to +0.5
        - Sentiment Q16-20 (Career): +0.3 to +0.5
        - Capability Dim 1 (Strategy): +0.5 to +0.7
        - Capability Dim 4 (Talent): +0.4 to +0.6
        - Capability Dim 6 (Innovation): +0.3 to +0.5
        - Capability Dim 7 (Adoption): +0.4 to +0.6
        - All other areas: +0.2 to +0.4 (ambient improvement)
        """
        print("\n📈 Creating Phase 2: March 2025 data...")
        print("   Interventions: A1 (Strategy), B2 (Training), C1 (Innovation)")
        
        # Sentiment improvements
        sentiment_p2 = sentiment_base.copy()
        id_col = 'respondent_id' if 'respondent_id' in sentiment_p2.columns else 'RespondentID'
        sentiment_p2[id_col] = sentiment_p2[id_col].apply(lambda x: f"MAR25_{x}")
        
        improvement_map = {
            'A1_strategy_org': (list(range(21, 26)), 0.5, 0.1),  # Q21-25: +0.5 avg
            'B2_training_collab': (list(range(6, 11)), 0.4, 0.08),  # Q6-10: +0.4 avg
            'C1_innovation_career': (list(range(16, 21)), 0.4, 0.08),  # Q16-20: +0.4 avg
        }
        
        for intervention, (questions, improvement, std) in improvement_map.items():
            for q in questions:
                col = f'sentiment_{q}'
                if col in sentiment_p2.columns:
                    boost = np.random.normal(improvement, std, len(sentiment_p2))
                    sentiment_p2[col] = np.minimum(sentiment_p2[col] + boost, 5.0)
        
        # Ambient improvement to all questions
        for i in range(1, 26):
            col = f'sentiment_{i}'
            if col in sentiment_p2.columns:
                ambient = np.random.normal(0.3, 0.05, len(sentiment_p2))
                sentiment_p2[col] = np.minimum(sentiment_p2[col] + ambient, 5.0)
        
        # Capability improvements
        capability_p2 = capability_base.copy()
        id_col = 'ResponseId_id' if 'ResponseId_id' in capability_p2.columns else 'respondent_id'
        capability_p2[id_col] = capability_p2[id_col].apply(lambda x: f"MAR25_{x}")
        
        high_impact_dims = {
            1: 0.6,  # Strategy & Vision
            4: 0.5,  # Talent & Skills
            6: 0.4,  # Innovation
            7: 0.5   # Adaptation & Adoption
        }
        
        for idx, row in capability_p2.iterrows():
            dim = row['dimension_id']
            if dim in high_impact_dims:
                boost = np.random.normal(high_impact_dims[dim], 0.1)
            else:
                boost = np.random.normal(0.3, 0.05)
            
            capability_p2.at[idx, 'score'] = min(row['score'] + boost, 5.0)
        
        # Calculate improvements
        sentiment_cols = [f'sentiment_{i}' for i in range(1, 26)]
        sent_improvement = (
            sentiment_p2[sentiment_cols].mean().mean() - 
            sentiment_base[sentiment_cols].mean().mean()
        )
        cap_improvement = capability_p2['score'].mean() - capability_base['score'].mean()
        
        print(f"   ✓ Sentiment improved by: +{sent_improvement:.3f} ({sent_improvement/sentiment_base[sentiment_cols].mean().mean()*100:.1f}%)")
        print(f"   ✓ Capability improved by: +{cap_improvement:.3f} ({cap_improvement/capability_base['score'].mean()*100:.1f}%)")
        
        return sentiment_p2, capability_p2
    
    def create_phase3_nov2025(self, sentiment_p2, capability_p2, sentiment_base, capability_base):
        """
        Phase 3: Nov 2025 - After implementing A3, B3, C2
        
        NEW Interventions (in addition to Phase 1):
        - A3: AI Ethics & Responsible AI Program
        - B3: Change Management & Communication
        - C2: AI Product Development Pipeline
        
        Expected improvements (cumulative from Phase 2):
        - All sentiment areas continue improving: +0.3 to +0.5 more
        - Dimension 8 (Ethics): +0.6 to +0.8
        - Dimension 5 (Org & Processes): +0.5 to +0.7
        - All dimensions: +0.3 to +0.5 more
        - Overall transformation visible across all metrics
        """
        print("\n📈 Creating Phase 3: Nov 2025 data...")
        print("   NEW Interventions: A3 (Ethics), B3 (Change Mgmt), C2 (Product Dev)")
        
        # Sentiment improvements (building on Phase 2)
        sentiment_p3 = sentiment_p2.copy()
        id_col = 'respondent_id' if 'respondent_id' in sentiment_p3.columns else 'RespondentID'
        
        # Change IDs from MAR25_ to NOV25_
        sentiment_p3[id_col] = sentiment_p3[id_col].apply(
            lambda x: x.replace('MAR25_', 'NOV25_') if 'MAR25_' in str(x) else f"NOV25_{x}"
        )
        
        improvement_map = {
            'A3_ethics': (list(range(11, 16)), 0.4, 0.08),  # Q11-15: Trust & Ethics
            'B3_change': (list(range(1, 6)), 0.4, 0.08),    # Q1-5: Personal acceptance
            'C2_product': (list(range(16, 21)), 0.3, 0.06), # Q16-20: Career growth
        }
        
        for intervention, (questions, improvement, std) in improvement_map.items():
            for q in questions:
                col = f'sentiment_{q}'
                if col in sentiment_p3.columns:
                    boost = np.random.normal(improvement, std, len(sentiment_p3))
                    sentiment_p3[col] = np.minimum(sentiment_p3[col] + boost, 5.0)
        
        # Strong ambient improvement (culture shift visible)
        for i in range(1, 26):
            col = f'sentiment_{i}'
            if col in sentiment_p3.columns:
                ambient = np.random.normal(0.4, 0.06, len(sentiment_p3))
                sentiment_p3[col] = np.minimum(sentiment_p3[col] + ambient, 5.0)
        
        # Capability improvements (building on Phase 2)
        capability_p3 = capability_p2.copy()
        id_col = 'ResponseId_id' if 'ResponseId_id' in capability_p3.columns else 'respondent_id'
        
        # Change IDs
        capability_p3[id_col] = capability_p3[id_col].apply(
            lambda x: x.replace('MAR25_', 'NOV25_') if 'MAR25_' in str(x) else f"NOV25_{x}"
        )
        
        high_impact_dims = {
            8: 0.7,  # Ethics & Responsibility (A3)
            5: 0.6,  # Org & Processes (B3)
            6: 0.5,  # Innovation (C2)
            2: 0.5,  # Data Maturity
            3: 0.5,  # Technology
        }
        
        for idx, row in capability_p3.iterrows():
            dim = row['dimension_id']
            if dim in high_impact_dims:
                boost = np.random.normal(high_impact_dims[dim], 0.1)
            else:
                boost = np.random.normal(0.4, 0.06)
            
            capability_p3.at[idx, 'score'] = min(row['score'] + boost, 5.0)
        
        # Calculate TOTAL improvements from baseline
        sentiment_cols = [f'sentiment_{i}' for i in range(1, 26)]
        sent_total = (
            sentiment_p3[sentiment_cols].mean().mean() - 
            sentiment_base[sentiment_cols].mean().mean()
        )
        cap_total = capability_p3['score'].mean() - capability_base['score'].mean()
        
        print(f"   ✓ TOTAL sentiment improvement from baseline: +{sent_total:.3f} ({sent_total/sentiment_base[sentiment_cols].mean().mean()*100:.1f}%)")
        print(f"   ✓ TOTAL capability improvement from baseline: +{cap_total:.3f} ({cap_total/capability_base['score'].mean()*100:.1f}%)")
        
        return sentiment_p3, capability_p3
    
    def save_csvs(self, sentiment_base, capability_base, 
                   sentiment_p2, capability_p2,
                   sentiment_p3, capability_p3):
        """Save all CSVs for demo import"""
        print("\n💾 Saving CSV files...")
        
        # Phase 1 - Oct 2024 Baseline
        sentiment_base.to_csv(self.output_dir / 'oct_2024_baseline_sentiment.csv', index=False)
        capability_base.to_csv(self.output_dir / 'oct_2024_baseline_capability.csv', index=False)
        print("   ✓ Oct 2024 Baseline CSVs")
        
        # Phase 2 - March 2025
        sentiment_p2.to_csv(self.output_dir / 'march_2025_phase2_sentiment.csv', index=False)
        capability_p2.to_csv(self.output_dir / 'march_2025_phase2_capability.csv', index=False)
        print("   ✓ March 2025 Phase 2 CSVs")
        
        # Phase 3 - Nov 2025
        sentiment_p3.to_csv(self.output_dir / 'nov_2025_phase3_sentiment.csv', index=False)
        capability_p3.to_csv(self.output_dir / 'nov_2025_phase3_capability.csv', index=False)
        print("   ✓ Nov 2025 Phase 3 CSVs")
        
        return {
            'baseline': (sentiment_base, capability_base),
            'phase2': (sentiment_p2, capability_p2),
            'phase3': (sentiment_p3, capability_p3)
        }
    
    def generate_story_document(self, data_sets):
        """Generate comprehensive story document"""
        sentiment_base, capability_base = data_sets['baseline']
        sentiment_p2, capability_p2 = data_sets['phase2']
        sentiment_p3, capability_p3 = data_sets['phase3']
        
        sentiment_cols = [f'sentiment_{i}' for i in range(1, 26)]
        
        story = {
            'organization': 'Acme Wealth Advisors',
            'assessment_journey': {
                'phase1_baseline': {
                    'date': '2024-10-15',
                    'name': 'Oct 2024 Baseline',
                    'respondents': len(sentiment_base),
                    'sentiment_avg': float(sentiment_base[sentiment_cols].mean().mean()),
                    'capability_avg': float(capability_base['score'].mean()),
                    'interventions': [],
                    'key_findings': [
                        'Low trust in AI autonomy (avg 2.8/5)',
                        'Limited strategic alignment (Dim 1: 3.1/5)',
                        'Gaps in talent readiness (Dim 4: 3.0/5)',
                        'Innovation capability nascent (Dim 6: 2.9/5)'
                    ]
                },
                'phase2_progress': {
                    'date': '2025-03-15',
                    'name': 'March 2025 - Phase 2',
                    'respondents': len(sentiment_p2),
                    'sentiment_avg': float(sentiment_p2[sentiment_cols].mean().mean()),
                    'capability_avg': float(capability_p2['score'].mean()),
                    'interventions': ['A1', 'B2', 'C1'],
                    'improvements': {
                        'sentiment': f"+{(sentiment_p2[sentiment_cols].mean().mean() - sentiment_base[sentiment_cols].mean().mean()):.2f}",
                        'capability': f"+{(capability_p2['score'].mean() - capability_base['score'].mean()):.2f}",
                        'percent_improvement': f"{((sentiment_p2[sentiment_cols].mean().mean() - sentiment_base[sentiment_cols].mean().mean()) / sentiment_base[sentiment_cols].mean().mean() * 100):.1f}%"
                    },
                    'key_wins': [
                        'Strategy clarity improved 18%',
                        'Collaboration trust up 15%',
                        'Training effectiveness visible',
                        'Innovation culture emerging'
                    ]
                },
                'phase3_transformation': {
                    'date': '2025-11-15',
                    'name': 'Nov 2025 - Phase 3',
                    'respondents': len(sentiment_p3),
                    'sentiment_avg': float(sentiment_p3[sentiment_cols].mean().mean()),
                    'capability_avg': float(capability_p3['score'].mean()),
                    'interventions': ['A1', 'A3', 'B2', 'B3', 'C1', 'C2'],
                    'improvements': {
                        'sentiment_total': f"+{(sentiment_p3[sentiment_cols].mean().mean() - sentiment_base[sentiment_cols].mean().mean()):.2f}",
                        'capability_total': f"+{(capability_p3['score'].mean() - capability_base['score'].mean()):.2f}",
                        'percent_total': f"{((sentiment_p3[sentiment_cols].mean().mean() - sentiment_base[sentiment_cols].mean().mean()) / sentiment_base[sentiment_cols].mean().mean() * 100):.1f}%"
                    },
                    'transformation_markers': [
                        'Ethics & responsibility embedded (Dim 8: +0.7)',
                        'Organizational readiness achieved',
                        'Sustained adoption patterns',
                        'Culture shift measurable across all levels'
                    ]
                }
            },
            'roi_analysis': {
                'total_investment': '$850K over 13 months',
                'measurable_improvements': {
                    'sentiment_score': f"+{((sentiment_p3[sentiment_cols].mean().mean() - sentiment_base[sentiment_cols].mean().mean()) / sentiment_base[sentiment_cols].mean().mean() * 100):.1f}%",
                    'capability_maturity': f"+{((capability_p3['score'].mean() - capability_base['score'].mean()) / capability_base['score'].mean() * 100):.1f}%",
                    'readiness_level': 'Advanced'
                },
                'business_impact': [
                    'Accelerated AI adoption timeline by 6 months',
                    'Reduced resistance and change fatigue',
                    'Built sustainable innovation capability',
                    'Established ethical AI framework'
                ]
            }
        }
        
        story_path = self.output_dir / 'transformation_story.json'
        with open(story_path, 'w') as f:
            json.dump(story, f, indent=2)
        
        print(f"\n📄 Transformation story saved: {story_path}")
        return story

def main():
    generator = JourneyGenerator('/Users/Dev/Desktop/ainavigator/data/csv-imports')
    
    print("=" * 60)
    print("🚀 ACME WEALTH ADVISORS - AI TRANSFORMATION JOURNEY")
    print("=" * 60)
    
    # Load baseline
    sentiment_base, capability_base = generator.load_baseline()
    
    # Create Phase 2
    sentiment_p2, capability_p2 = generator.create_phase2_march2025(
        sentiment_base, capability_base
    )
    
    # Create Phase 3
    sentiment_p3, capability_p3 = generator.create_phase3_nov2025(
        sentiment_p2, capability_p2,
        sentiment_base, capability_base
    )
    
    # Save all CSVs
    data_sets = generator.save_csvs(
        sentiment_base, capability_base,
        sentiment_p2, capability_p2,
        sentiment_p3, capability_p3
    )
    
    # Generate story
    story = generator.generate_story_document(data_sets)
    
    print("\n" + "=" * 60)
    print("✨ TRANSFORMATION COMPLETE")
    print("=" * 60)
    print(f"\n📊 Journey Overview:")
    print(f"   Phase 1 (Oct 2024):  Baseline")
    print(f"   Phase 2 (Mar 2025):  +{story['assessment_journey']['phase2_progress']['improvements']['percent_improvement']} improvement")
    print(f"   Phase 3 (Nov 2025):  +{story['assessment_journey']['phase3_transformation']['improvements']['percent_total']} total improvement")
    print(f"\n📁 Files ready in: {generator.output_dir}")
    print("\n✅ Ready for demo import!")

if __name__ == '__main__':
    main()

