/*
  # Update role function for new admin email

  1. Changes
    - Update role() function to use new admin email
    - Function remains security definer to ensure proper access

  2. Security
    - Function runs with definer security
    - Checks specific admin email
*/

CREATE OR REPLACE FUNCTION public.role()
RETURNS text AS $$
BEGIN
  RETURN CASE 
    WHEN auth.jwt()->>'email' = 'tcgtechnology01@gmail.com' THEN 'admin'
    ELSE 'user'
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;