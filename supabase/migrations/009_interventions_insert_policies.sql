-- Add INSERT policies for intervention tables
-- This allows the import script to populate intervention data

-- Public insert access for interventions (data is not company-specific)
CREATE POLICY "Public insert access for interventions"
  ON interventions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public insert access for sentiment mappings"
  ON intervention_sentiment_mappings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public insert access for capability mappings"
  ON intervention_capability_mappings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public insert access for next steps"
  ON intervention_next_steps FOR INSERT
  WITH CHECK (true);

-- Also add UPDATE policies for upsert operations
CREATE POLICY "Public update access for interventions"
  ON interventions FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public update access for sentiment mappings"
  ON intervention_sentiment_mappings FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public update access for capability mappings"
  ON intervention_capability_mappings FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public update access for next steps"
  ON intervention_next_steps FOR UPDATE
  USING (true)
  WITH CHECK (true);

