/*
  # Create job applications table

  1. New Tables
    - `job_applications`
      - `id` (uuid, primary key)
      - `first_name` (text, not null)
      - `last_name` (text, nullable)
      - `email` (text, not null)
      - `contact` (text, not null)
      - `graduation_year` (integer, not null)
      - `gender` (text, not null)
      - `position` (text, not null)
      - `experience` (text, not null)
      - `current_employer` (text, not null)
      - `current_salary` (text, nullable)
      - `expected_salary` (text, nullable)
      - `skills` (text, not null)
      - `location` (text, not null)
      - `resume_url` (text, nullable)
      - `status` (text, default 'pending')
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - No RLS needed as this will be managed through admin interface
*/

CREATE TABLE IF NOT EXISTS job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text,
  email text NOT NULL,
  contact text NOT NULL,
  graduation_year integer NOT NULL,
  gender text NOT NULL,
  position text NOT NULL,
  experience text NOT NULL,
  current_employer text NOT NULL,
  current_salary text,
  expected_salary text,
  skills text NOT NULL,
  location text NOT NULL,
  resume_url text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON job_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);