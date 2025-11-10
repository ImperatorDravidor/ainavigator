# Growth Indicators Implementation

## Summary

Added comprehensive growth indicators throughout the platform to showcase improvement from Baseline → Phase 2 in an addictive, visually engaging way.

## Features Implemented

### 1. Sentiment Heatmap Delta Indicators ✅

**Component**: `components/sentiment/SentimentHeatmapRevised.tsx`

**What Changed**:
- Added `baselineData` and `showDelta` props
- Calculates delta for each heatmap cell vs baseline
- Shows small animated badges in bottom-left corner of each cell
- Green (with TrendingDown icon) = Improvement (resistance decreased)
- Red (with TrendingUp icon) = Worse (resistance increased)

**Visual Design**:
```tsx
// Green improvement badge
<div className="bg-emerald-500/95 border-emerald-300/50">
  <TrendingDown className="w-2.5 h-2.5" />
  <span>0.25</span> // Amount of decrease
</div>

// Red worsening badge
<div className="bg-red-500/95 border-red-300/50">
  <TrendingUp className="w-2.5 h-2.5" />
  <span>0.15</span> // Amount of increase
</div>
```

**Behavior**:
- Only shows in Phase 2 (when `selectedWave !== 'oct-2024-baseline'`)
- Hides if delta is exactly 0
- Animates in with scale/opacity transition
- Shows absolute value with appropriate icon direction

### 2. Capability Dimension Growth Badges ✅

**Component**: `components/capability/CapabilityAnalysisPro.tsx`

**What Changed**:
- Added `baselineData` and `showDelta` props
- Calculates growth percentage for each dimension vs baseline
- Shows inline growth badge next to dimension name
- Only displays if growth is > 1% (filters noise)

**Visual Design**:
```tsx
// Green growth badge (improvement)
<span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700">
  <TrendingUp className="w-2.5 h-2.5" />
  +18%
</span>

// Red decline badge (worse)
<span className="bg-red-100 dark:bg-red-500/20 text-red-700">
  <TrendingDown className="w-2.5 h-2.5" />
  -5%
</span>
```

**Behavior**:
- Only shows in Phase 2
- Hides if growth < 1% (reduces clutter)
- Animates in next to dimension name
- Shows percentage change from baseline

### 3. Data Loading Architecture ✅

**Component**: `app/assessment/page.tsx`

**What Changed**:
- Added `baselineSentimentData` and `baselineCapabilityData` state
- Modified `loadData()` function to automatically fetch baseline data when viewing non-baseline phases
- Passes baseline data to both heatmap and capability components
- `showDelta={selectedWave !== 'oct-2024-baseline' && baselineData.length > 0}`

**Loading Logic**:
```typescript
if (wave !== 'oct-2024-baseline') {
  // Load baseline for comparison
  const baselineSentimentResponse = await fetch('/api/data/respondents?survey_wave=oct-2024-baseline')
  setBaselineSentimentData(result.data)

  const baselineCapabilityResponse = await fetch('/api/data/capability?survey_wave=oct-2024-baseline')
  setBaselineCapabilityData(result.data)
} else {
  // Clear baseline data when viewing baseline itself
  setBaselineSentimentData([])
  setBaselineCapabilityData([])
}
```

## Expected User Experience

### Viewing Baseline (Oct 2024):
- No growth indicators visible
- Shows raw data with color-coded intensity
- Clean, uncluttered view

### Viewing Phase 2 (Mar 2025):
- **Sentiment Heatmap**: Small green badges appear on cells showing improvement (e.g., "-0.35" with down arrow)
- **Capability Dimensions**: Growth badges next to dimension names (e.g., "Strategy & Vision +18%")
- **Addictive Factor**: Immediate visual feedback showing "wins" in green

## Color Semantics

### Sentiment (Resistance):
- **Green + Down Arrow** = GOOD (resistance decreased)
- **Red + Up Arrow** = BAD (resistance increased)
- Lower numbers = Better (less resistance)

### Capability (Maturity):
- **Green + Up Arrow** = GOOD (capability increased)
- **Red + Down Arrow** = BAD (capability decreased)
- Higher numbers = Better (more mature)

## Performance Considerations

- Baseline data loaded once when switching to Phase 2
- Cached in state for duration of session
- Delta calculations use memoized hooks
- Only renders badges when `showDelta={true}`

## Files Modified

1. **`components/sentiment/SentimentHeatmapRevised.tsx`**:
   - Lines 14-20: Added props
   - Lines 22-53: Added baseline calculation and getCellDelta function
   - Lines 370-396: Added delta badge rendering

2. **`components/capability/CapabilityAnalysisPro.tsx`**:
   - Lines 16-25: Added props
   - Lines 46-50: Added baseline assessment calculation
   - Lines 572-610: Added growth calculation and badge rendering

3. **`app/assessment/page.tsx`**:
   - Lines 67-68: Added baseline data state
   - Lines 438-467: Added baseline data loading logic
   - Line 1228-1229: Pass baseline data to SentimentHeatmapRevised
   - Line 1300-1301: Pass baseline data to CapabilityAnalysisPro

## Future Enhancements

### Not Yet Implemented:
- [ ] Growth indicators in dimension detail/drilldown views
- [ ] Sparklines showing trend over time
- [ ] Side-by-side comparison mode
- [ ] Celebration animations for major improvements
- [ ] Summary card showing total improvements count
- [ ] Intervention attribution (which interventions drove which improvements)

### Addictive UX Ideas:
- [ ] Progress bars filling up on load
- [ ] Confetti animation for >20% improvements
- [ ] Achievement badges ("10 cells improved!")
- [ ] Gamification: "Improvement Score" metric
- [ ] Before/After slider toggle
- [ ] Highlight cells with biggest improvements

## Testing

```bash
npm run dev
```

1. Navigate to `/assessment`
2. Select "Baseline (Oct 2024)" - should see NO growth indicators
3. Select "Phase 2 (Mar 2025)" - should see:
   - Green badges on heatmap cells that improved
   - Growth percentages next to dimension names
   - All badges animate in smoothly

## Data Requirements

For growth indicators to work:
- Both `oct-2024-baseline` and `mar-2025-phase2` data must exist in database
- Data must have matching `cellId` structures for sentiment
- Data must have matching `dimensionId` structures for capability
