/*
  # Seed diseases table
  
  This migration adds common goat diseases with their symptoms, treatments, and prevention methods.
  
  1. Data Added
    - Common goat diseases including:
      - Pneumonia
      - Mastitis
      - Enterotoxemia
      - Caseous Lymphadenitis
      - Foot Rot
      - Coccidiosis
      - Caprine Arthritis Encephalitis
      - Johnes Disease
*/

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
