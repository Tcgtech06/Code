/*
  # Update job postings RLS policies

  1. Changes
    - Drop existing policies
    - Create new policies with proper admin role check
    - Maintain public read access

  2. Security
    - Use proper role() function check for admin access
    - Ensure public read access is maintained
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow admin to manage job postings" ON job_postings;
DROP POLICY IF EXISTS "Allow public read access" ON job_postings;

-- Recreate policies with proper checks
CREATE POLICY "Allow public read access"
  ON job_postings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow admin to manage job postings"
  ON job_postings
  FOR ALL
  TO authenticated
  USING (role() = 'admin')
  WITH CHECK (role() = 'admin');