/*
  # Update role function to handle null JWT

  1. Changes
    - Update role() function to handle cases where JWT is null
    - Add proper error handling
    - Maintain existing admin email check

  2. Security
    - Function runs with definer security
    - Safely handles null JWT cases
    - Maintains admin email check
*/

CREATE OR REPLACE FUNCTION public.role()
RETURNS text AS $$
BEGIN
  IF auth.jwt() IS NULL THEN
    RETURN 'anonymous';
  END IF;

  RETURN CASE 
    WHEN auth.jwt()->>'email' = 'tcgtechnology01@gmail.com' THEN 'admin'
    ELSE 'user'
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;