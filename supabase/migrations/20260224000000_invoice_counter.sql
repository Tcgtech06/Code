/*
  # Add invoice counter table for reliable auto-increment
  
  1. New Tables
    - `invoice_counter`
      - `id` (integer, primary key) - always 1, single row table
      - `current_number` (integer) - current invoice number
      - `updated_at` (timestamp)
  
  2. Functions
    - `get_next_invoice_number()` - atomically gets and increments the counter
  
  3. Security
    - Enable RLS on `invoice_counter` table
    - Add policies for public access
*/

-- Create invoice counter table (single row table)
CREATE TABLE IF NOT EXISTS invoice_counter (
  id integer PRIMARY KEY DEFAULT 1,
  current_number integer NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Initialize with current max invoice number from existing invoices
INSERT INTO invoice_counter (id, current_number)
SELECT 1, COALESCE(
  (SELECT MAX(CAST(SUBSTRING(invoice_number FROM 'INV-(\d+)') AS INTEGER))
   FROM invoices
   WHERE invoice_number ~ '^INV-\d+$'),
  0
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE invoice_counter ENABLE ROW LEVEL SECURITY;

-- Create policy for public access
CREATE POLICY "Allow all operations on invoice_counter"
  ON invoice_counter
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create function to get next invoice number atomically
CREATE OR REPLACE FUNCTION get_next_invoice_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  next_num integer;
  invoice_num text;
BEGIN
  -- Lock the row and increment the counter
  UPDATE invoice_counter
  SET current_number = current_number + 1,
      updated_at = now()
  WHERE id = 1
  RETURNING current_number INTO next_num;
  
  -- Format as INV-0001, INV-0002, etc.
  invoice_num := 'INV-' || LPAD(next_num::text, 4, '0');
  
  RETURN invoice_num;
END;
$$;

-- Grant execute permission to public
GRANT EXECUTE ON FUNCTION get_next_invoice_number() TO public;
