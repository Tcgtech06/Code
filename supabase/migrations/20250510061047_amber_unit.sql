/*
  # Create job postings table

  1. New Tables
    - `job_postings`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `location` (text, not null)
      - `type` (text, not null)
      - `description` (text, not null)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `job_postings` table
    - Add policies for authenticated admin to manage postings
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS job_postings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  location text NOT NULL,
  type text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access"
  ON job_postings
  FOR SELECT
  TO public
  USING (true);

-- Allow admin to manage job postings
CREATE POLICY "Allow admin to manage job postings"
  ON job_postings
  FOR ALL
  TO authenticated
  USING (auth.role() = 'admin')
  WITH CHECK (auth.role() = 'admin');