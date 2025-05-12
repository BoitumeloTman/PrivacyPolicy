/*
  # Initial Bokamoso Farm Management System Schema

  1. New Tables
     - `profiles`: User profiles with role information
     - `payslips`: Employee/student payroll records
     - `leave_applications`: Employee/student leave requests
     - `livestock`: Goat registry table
     - `treatments`: Livestock health treatment records
     - `diseases`: Reference table for diseases and treatments
     - `student_timetables`: Student class schedules 
     - `cooking_schedule`: Student cooking duty roster

  2. Security
     - Enable RLS on all tables
     - Add policies for authenticated users
     - Service role has full access
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('employee', 'student', 'employer', 'admin'))
);

ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profile
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profile
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Payslips table
CREATE TABLE IF NOT EXISTS payslips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  document_url TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'paid')) DEFAULT 'pending'
);

ALTER TABLE payslips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payslips"
  ON payslips
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can create payslips"
  ON payslips
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Leave applications table
CREATE TABLE IF NOT EXISTS leave_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending'
);

ALTER TABLE leave_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own leave applications"
  ON leave_applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own leave applications"
  ON leave_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins and employers can view all leave applications"
  ON leave_applications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profile
      WHERE profile.id = auth.uid() AND profile.role IN ('admin', 'employer')
    )
  );

-- Livestock table
CREATE TABLE IF NOT EXISTS livestock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tag_number TEXT NOT NULL UNIQUE,
  nickname TEXT,
  status TEXT CHECK (status IN ('healthy', 'sick', 'missing', 'deceased')) DEFAULT 'healthy',
  image_url TEXT,
  last_dosed DATE
);

ALTER TABLE livestock ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view livestock"
  ON livestock
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and employers can manage livestock"
  ON livestock
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'employer')
    )
  );

-- Treatments table
CREATE TABLE IF NOT EXISTS treatments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  livestock_id UUID REFERENCES livestock(id) ON DELETE CASCADE,
  symptoms TEXT[] NOT NULL,
  diagnosis TEXT NOT NULL,
  treatment TEXT NOT NULL,
  date_treated DATE NOT NULL
);

ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view treatments"
  ON treatments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and employers can manage treatments"
  ON treatments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'employer')
    )
  );

-- Diseases reference table
CREATE TABLE IF NOT EXISTS diseases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  symptoms TEXT[] NOT NULL,
  treatment TEXT NOT NULL,
  prevention TEXT NOT NULL
);

ALTER TABLE diseases ENABLE ROW LEVEL SECURITY;

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

-- Student timetables table
CREATE TABLE IF NOT EXISTS student_timetables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  document_url TEXT,
  timetable_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE student_timetables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view and manage own timetables"
  ON student_timetables
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins and employers can view student timetables"
  ON student_timetables
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profile
      WHERE profile.id = auth.uid() AND profile.role IN ('admin', 'employer')
    )
  );

-- Cooking schedule table
CREATE TABLE IF NOT EXISTS cooking_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  meal TEXT CHECK (meal IN ('breakfast', 'lunch', 'dinner')) NOT NULL
);

ALTER TABLE cooking_schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view cooking schedule"
  ON cooking_schedule
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage cooking schedule"
  ON cooking_schedule
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profile
      WHERE profile.id = auth.uid() AND profile.role = 'admin'
    )
  );

-- Function to create a profile after user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profile (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile after auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();