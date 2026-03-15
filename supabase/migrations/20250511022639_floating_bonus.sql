/*
  # Create role function

  1. Changes
    - Create role() function to check admin status
    - Function is security definer to ensure proper access

  2. Security
    - Function runs with definer security
    - Checks specific admin email
*/

CREATE OR REPLACE FUNCTION public.role()
RETURNS text AS $$
BEGIN
  RETURN CASE 
    WHEN auth.jwt()->>'email' = 'admin@tcgtechnology.com' THEN 'admin'
    ELSE 'user'
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;