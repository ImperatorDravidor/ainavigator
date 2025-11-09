# Temporal Tracking & Progress Measurement Setup Guide

## Overview

This guide covers the setup and use of the temporal tracking system that allows you to:
- Create baseline assessments (Oct 2024)
- Track which interventions were implemented
- Upload new assessment snapshots (Nov 2024, etc.)
- Compare progress over time
- See intervention impact

## Database Setup

### Step 1: Run the Baseline Migration

```bash
cd supabase
psql YOUR_DATABASE_URL -f migrations/011_oct_2024_baseline.sql
```

This will:
- Tag all existing data as "Oct 2024 Baseline"
- Create the assessment period record
- Set `survey_wave = 'oct-2024-baseline'`
- Set `assessment_date = '2024-10-15'`

### Step 2: Generate November 2024 Data (Optional)

If you want to test the temporal comparison with synthetic improved data:

```bash
cd scripts
python3 generate_nov_2024_data.py
```

This will:
- Load the Oct 2024 baseline
- Apply improvements simulating the impact of interventions A1, B2, C1
- Generate `012_nov_2024_data.sql` migration file
- Save CSV files for reference

### Step 3: Load November 2024 Data (Optional)

```bash
cd supabase
psql YOUR_DATABASE_URL -f migrations/012_nov_2024_data.sql
```

## Using the Application

### 1. Assessment Period Selector

In the left sidebar (Filter Panel), you'll see the **Assessment Period** selector:

- **Oct 2024 Baseline** - Shows as "Active" by default
- **Previous Assessments** - Will appear as you add more snapshots
- **Compare** button - Toggle to enable side-by-side comparison

### 2. Mark Interventions as Implemented

Before uploading a new snapshot:

1. Navigate to **Interventions** section
2. Select the baseline period (Oct 2024)
3. Click **"Mark as Implemented"** on interventions you applied (e.g., A1, B2, C1)
4. Enter the implementation date
5. Add notes about the rollout

This tracks which interventions were in place before the next assessment.

### 3. Import New Snapshot

When you're ready to upload new assessment data:

1. Click the **Import** button in the header (next to Export)
2. **Step 1: Confirmation**
   - Review the checklist
   - Ensure interventions are marked
3. **Step 2: Upload**
   - Enter snapshot name (e.g., "Nov 2024 Progress Check")
   - Select assessment date
   - Upload sentiment CSV file
   - Upload capability CSV file
   - Click "Upload & Import"

The system will:
- Create a new assessment period automatically
- Import both datasets
- Make them available for comparison
- Update respondent counts

### 4. Compare Progress

Once you have multiple periods:

1. Use the Assessment Period selector to switch between periods
2. Click **Compare** to enable side-by-side view
3. View dashboards, heatmaps, and capability charts for each period
4. See improvement percentages and trends

## CSV File Format

### Sentiment CSV

Required columns:
- `RespondentID` or `respondent_id`
- `Region`, `Department`, `EmploymentType`, `Age`, `UserLanguage`
- `Industry`, `Continent`
- `sentiment_1` through `sentiment_25` (numeric scores 1-5)
- Optional: `q39_achievements`, `q40_challenges`, `q41_future_goals`

### Capability CSV

Required columns:
- `respondent_id`
- `dimension_id` (1-8)
- `dimension` (name)
- `construct_id` (1-32)
- `construct` (name)
- `score` (numeric 1-5)
- `industry_synthetic`, `country_synthetic`, `continent_synthetic`, `role_synthetic`

## API Endpoints

### Assessment Periods

**GET** `/api/data/assessment-periods`
- Returns list of assessment periods for the company
- Ordered by date (most recent first)

**POST** `/api/data/assessment-periods`
- Create a new assessment period manually

### Applied Interventions

**GET** `/api/data/applied-interventions?assessment_period_id=UUID`
- Get interventions applied for a specific period

**POST** `/api/data/applied-interventions`
- Mark an intervention as implemented

Body:
```json
{
  "assessment_period_id": "uuid",
  "intervention_code": "A1",
  "applied_date": "2024-10-20",
  "status": "completed",
  "notes": "Rolled out to all departments"
}
```

### Import Snapshot

**POST** `/api/data/import-snapshot`
- Import new assessment snapshot

FormData:
- `snapshotName`: "Nov 2024 Progress Check"
- `assessmentDate`: "2024-11-15"
- `description`: "Follow-up assessment..."
- `sentimentFile`: File
- `capabilityFile`: File

## Database Schema

### assessment_periods Table

```sql
- id: UUID (primary key)
- company_id: UUID (foreign key)
- survey_wave: TEXT (e.g., 'oct-2024-baseline', 'nov-2024')
- assessment_date: DATE
- name: TEXT (display name)
- description: TEXT
- interventions_applied: TEXT[] (array of intervention codes)
- sentiment_respondents: INTEGER
- capability_respondents: INTEGER
- status: TEXT ('active', 'draft', 'archived')
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### applied_interventions Table

```sql
- id: UUID (primary key)
- company_id: UUID
- assessment_period_id: UUID (foreign key)
- intervention_code: VARCHAR (foreign key to interventions)
- applied_date: DATE
- status: TEXT ('planned', 'in_progress', 'completed', 'abandoned')
- expected_impact: JSONB
- actual_impact: JSONB
- notes: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### respondents & capability_scores Updates

Both tables now include:
- `survey_wave`: TEXT (links to assessment_periods.survey_wave)
- `assessment_date`: DATE (date of this specific assessment)

## Best Practices

1. **Before Each New Assessment:**
   - Review and mark implemented interventions
   - Document implementation dates accurately
   - Add notes about rollout challenges or successes

2. **CSV Data Quality:**
   - Ensure consistent respondent ID format
   - Validate score ranges (1-5)
   - Check for missing values
   - Maintain consistent demographic categories

3. **Comparison Analysis:**
   - Compare same demographic segments
   - Look for intervention-specific improvements
   - Document unexpected changes
   - Track both sentiment and capability together

4. **Timeline:**
   - Allow adequate time between assessments (4-12 weeks)
   - Time assessments after intervention milestones
   - Consider seasonal factors in your organization

## Troubleshooting

### "Assessment period already exists"
- Check if you've already imported data for this date
- Use a different date or delete the existing period

### Import fails partway through
- The system rolls back changes automatically
- Check CSV format matches requirements
- Verify file encoding (UTF-8)
- Check for special characters in text fields

### Interventions not showing in new period
- Ensure you marked them as "implemented" in the PREVIOUS period
- Check the applied_date is before the new assessment date

### Data not filtering by period
- Verify `survey_wave` matches between `assessment_periods` and data tables
- Check browser console for API errors
- Ensure company_id is correct in all tables

## Next Steps

- Set up automated CSV exports from your survey tool
- Schedule regular assessment cycles (quarterly recommended)
- Create executive dashboards comparing periods
- Export comparison PDFs for stakeholder reporting

## Support

For questions or issues:
1. Check the browser console for errors
2. Review API endpoint logs
3. Verify database constraints
4. Check the GitHub issues for similar problems

