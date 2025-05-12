/*
  # Create and seed diseases table
  
  This migration:
  1. Creates the diseases table for tracking common goat diseases
  2. Adds initial seed data for common diseases
  
  Tables:
  - diseases
    - id (uuid, primary key)
    - name (text, unique)
    - symptoms (text array)
    - treatment (text)
    - prevention (text)
*/

-- Create diseases table
CREATE TABLE IF NOT EXISTS diseases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  symptoms TEXT[] NOT NULL,
  treatment TEXT NOT NULL,
  prevention TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE diseases ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "All authenticated users can view diseases"
  ON diseases
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage diseases"
  ON diseases
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Seed common goat diseases with symptoms and treatments
INSERT INTO diseases (name, symptoms, treatment, prevention) VALUES
(
  'Pneumonia',
  ARRAY['Coughing', 'Nasal discharge', 'Fever', 'Difficulty breathing', 'Depression'],
  'Antibiotics (oxytetracycline or tylosin), anti-inflammatory drugs, and good nursing care. Keep the animal in a well-ventilated, dry environment.',
  'Well-ventilated housing, avoid overcrowding, minimize stress, proper nutrition, vaccination.'
),
(
  'Mastitis',
  ARRAY['Swollen udder', 'Pain when touched', 'Abnormal milk (watery, clotted)', 'Reduced milk production', 'Fever'],
  'Antibiotics, anti-inflammatory drugs, frequent milking of affected area. Isolate affected animals.',
  'Clean milking practices, proper nutrition, avoiding udder injuries, regular udder health checks.'
),
(
  'Enterotoxemia (Overeating Disease)',
  ARRAY['Sudden death', 'Bloating', 'Diarrhea', 'Convulsions', 'Loss of appetite'],
  'Antitoxin administration, antibiotics, reduce grain intake. Severe cases often fatal before treatment can be given.',
  'Vaccination, proper feeding management, gradual feed changes, avoid sudden increases in grain.'
),
(
  'Caseous Lymphadenitis (CL)',
  ARRAY['Abscesses in lymph nodes', 'Weight loss', 'Decreased production', 'Respiratory issues (internal abscesses)'],
  'Lancing and draining abscesses using strict hygiene protocols, antibiotics may help but cannot eliminate the disease.',
  'Isolation of infected animals, testing, culling policy, disinfection of facilities, vaccination.'
),
(
  'Foot Rot',
  ARRAY['Lameness', 'Foul odor', 'Redness between toes', 'Swelling of foot', 'Reluctance to walk'],
  'Foot trimming, footbaths with zinc sulfate or copper sulfate, antibiotics for severe cases, dry environment.',
  'Regular hoof trimming, keeping pens dry, footbaths, quarantine new animals, vaccination.'
),
(
  'Coccidiosis',
  ARRAY['Diarrhea (often with blood)', 'Weakness', 'Weight loss', 'Dehydration', 'Poor appetite'],
  'Anticoccidial medications (amprolium, sulfa drugs), supportive care with electrolytes and fluids.',
  'Good sanitation, avoid overcrowding, coccidiostats in feed for prevention in high-risk groups.'
),
(
  'Caprine Arthritis Encephalitis (CAE)',
  ARRAY['Joint swelling', 'Lameness', 'Weight loss', 'Hard udder', 'Neurological signs in kids'],
  'No cure. Treatment focuses on pain management, anti-inflammatory drugs, and supportive care.',
  'Test and cull program, feed heat-treated colostrum to kids, separate kids from dams at birth.'
),

  E'Johne\'s Disease',
  ARRAY['Weight loss despite good appetite', 'Diarrhea', 'Bottle jaw (swelling under jaw)', 'Weakness'],
  'No effective treatment. Management focuses on culling infected animals to prevent spread.',
  'Test and cull program, proper sanitation, controlling exposure of young animals to adult manure.'
