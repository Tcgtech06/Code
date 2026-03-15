/*
  # Remove RLS policies for job postings

  1. Changes
    - Drop existing RLS policies
    - Disable RLS on job_postings table
    - Drop role function as it's no longer needed

  2. Security
    - Table will be publicly accessible
    - No authentication required
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow admin to manage job postings" ON job_postings;
DROP POLICY IF EXISTS "Allow public read access" ON job_postings;

-- Disable RLS
ALTER TABLE job_postings DISABLE ROW LEVEL SECURITY;

-- Drop role function as it's no longer needed
DROP FUNCTION IF EXISTS public.role();