# Demo Day Cheat Sheet - 3-Phase Journey

## 🚀 Quick Setup (Do Before Demo)

```bash
# 1. Load Oct 2024 Baseline
cd /Users/Dev/Desktop/ainavigator
psql YOUR_DB -f supabase/migrations/011_oct_2024_baseline.sql

# 2. Start the app
npm run dev

# 3. Open http://localhost:3000/assessment
```

## 📁 Import Files Ready

Located in: `/Users/Dev/Desktop/ainavigator/data/csv-imports/journey/`

**Phase 2 (March 2025):**
- `march_2025_phase2_sentiment.csv`
- `march_2025_phase2_capability.csv`

**Phase 3 (Nov 2025):**
- `nov_2025_phase3_sentiment.csv`
- `nov_2025_phase3_capability.csv`

## 🎭 The 3-Act Story (60 seconds)

### Act 1: Oct 2024 Baseline (20s)
**Show:** Red heatmap, low scores (2.09/5)  
**Say:** "Acme Wealth had a problem - employees anxious about AI, no strategy, limited capability."

### Act 2: March 2025 Progress (20s)
**Show:** Click dropdown → March 2025, see improvement (+26.8%)  
**Say:** "Five months later, after strategy, training, and innovation labs - culture shifting."

### Act 3: Nov 2025 Transformation (20s)
**Show:** Click → Nov 2025, dramatic improvement (+56.5%)  
**Say:** "Thirteen months total. 56.5% improvement. This is data-driven transformation."

## 📊 Key Numbers (Memorize These)

| Metric | Baseline | Phase 2 | Phase 3 |
|--------|----------|---------|---------|
| **Sentiment Avg** | 2.09/5 | 2.65/5 | 3.27/5 |
| **Improvement** | - | +26.8% | +56.5% |
| **Capability Avg** | 4.25/5 | 3.94/5 | 4.21/5 |
| **Investment** | $0 | $600K | $850K |
| **Interventions** | None | A1,B2,C1 | +A3,B3,C2 |

## 🎯 Live Demo Flow (5 minutes)

### Minute 1: Baseline (Oct 2024)
1. Show dashboard - "Look at these problems"
2. Click sentiment heatmap - "Red zones everywhere"
3. Show capability radar - "Gaps in strategy, talent, innovation"
4. Point to sidebar - "Oct 2024 Baseline - this is where we started"

### Minute 2: Import Phase 2 (Live!)
1. Click purple "Import" button in header
2. Enter details:
   - Name: "March 2025 - Phase 2"
   - Date: 2025-03-15
   - Upload both CSV files
3. Click "Upload & Import"
4. Wait for success message

### Minute 3: Show Phase 2 Progress
1. Sidebar now shows "March 2025 - Phase 2"
2. Click it - **watch everything update**
3. Point out: "After: A1, B2, C1" badges
4. Show improved heatmap - "Yellow zones appearing"
5. Show capability improvements - "Strategy up 0.6 points"

### Minute 4: Import Phase 3 (Live!)
1. Click "Import" again
2. Enter details:
   - Name: "Nov 2025 - Phase 3"
   - Date: 2025-11-15
   - Upload Phase 3 CSV files
3. Import completes

### Minute 5: The Transformation
1. Click "Nov 2025 - Phase 3" in sidebar
2. **Dramatic improvement visible**
3. Show "After: A1, A3, B2, B3, C1, C2"
4. Navigate: Oct → Mar → Nov (show progression)
5. **Power moment:** "This is measurable transformation"

## 💬 Killer Lines

### Opening
> "What if you could measure your AI transformation as precisely as your financial metrics?"

### During Act 1
> "2.09 out of 5. People were scared. Strategy was missing. This is reality."

### During Act 2  
> "Five months, three interventions, 26.8% improvement. Not hope - measurement."

### During Act 3
> "56.5% improvement. No guesswork. No hoping. Data-driven transformation."

### Closing
> "Every enterprise says they want AI readiness. This platform shows you how to get there, step by step, with proof."

## ⚠️ If Something Goes Wrong

**Import fails:**
- Check CSV files are in `/journey/` folder
- Verify database is running
- Refresh page and try again

**No data showing:**
- Make sure baseline migration ran
- Check Assessment Period dropdown shows "Oct 2024 Baseline"
- Verify company_id matches (should be 'acme-wealth')

**Can't switch periods:**
- Click directly on the period in the sidebar
- Wait for page to reload
- All charts should update automatically

## 🎯 Questions They'll Ask

**Q: "How long does an assessment take?"**
A: "15-20 minutes per employee. 500 people = 2-3 weeks total."

**Q: "How much does this cost?"**
A: "Platform license + intervention investments. Acme spent $850K over 13 months for complete transformation."

**Q: "Can we customize the assessments?"**
A: "Yes - add your own questions, dimensions, and interventions."

**Q: "What's the ROI?"**
A: "56.5% improvement in 13 months. 6 months accelerated timeline. Eliminated change resistance. Sustainable AI capability built."

**Q: "How often should we assess?"**
A: "Every 4-6 months. Measure, act, measure again."

## 🚀 The Close

After showing all 3 phases:

> "Imagine showing THIS to your board. Not PowerPoint promises - actual data. Baseline, progress, transformation. Interventions tracked. ROI measured. That's what this platform does. And you just saw it happen live."

**Pause. Let it sink in.**

> "Who else wants to transform their AI readiness with this level of confidence?"

## ✅ Pre-Demo Checklist

- [ ] Database baseline loaded
- [ ] App running locally
- [ ] CSV files in `/journey/` folder ready
- [ ] Numbers memorized (2.09 → 2.65 → 3.27)
- [ ] Story rehearsed (Oct → Mar → Nov)
- [ ] Import flow tested once
- [ ] Backup: Screenshots of each phase
- [ ] Confident, ready, excited! 🎉

---

**Remember:** The power is in the PROGRESSION. Oct → Mar → Nov. Show them the journey, not just the destination.

**Good luck! You've got this!** 🚀

