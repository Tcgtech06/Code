/*
  # Create positions table for job designations

  1. New Tables
    - `positions`
      - `id` (uuid, primary key)
      - `title` (text, not null, unique)
      - `created_at` (timestamp with time zone)
*/

CREATE TABLE IF NOT EXISTS positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Insert default positions
INSERT INTO positions (title) VALUES
  ('Web Developer'),
  ('UI/UX Designer'),
  ('App Developer'),
  ('Software Developer'),
  ('AI Developer'),
  ('React Developer')
ON CONFLICT (title) DO NOTHING;

-- Add position_id to job_postings
ALTER TABLE job_postings ADD COLUMN position_id uuid REFERENCES positions(id);