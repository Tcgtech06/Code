/*
  # Create invoices table for storing generated invoices

  1. New Tables
    - `invoices`
      - `id` (uuid, primary key)
      - `invoice_number` (text, unique)
      - `client_name` (text)
      - `client_email` (text)
      - `client_address` (text)
      - `invoice_date` (date)
      - `due_date` (date)
      - `items` (jsonb) - stores array of invoice items
      - `subtotal` (decimal)
      - `tax_rate` (decimal)
      - `tax_amount` (decimal)
      - `total` (decimal)
      - `notes` (text)
      - `status` (text) - draft, sent, paid, etc.
      - `version` (integer) - for tracking edits
      - `original_id` (uuid) - references original invoice if this is an edited version
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `invoices` table
    - Add policies for public access (since this is admin functionality)

  3. Indexes
    - Index on invoice_number for fast searching
    - Index on client_name for client-based searches
    - Index on created_at for chronological ordering
*/

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  client_name text NOT NULL,
  client_email text,
  client_address text,
  invoice_date date NOT NULL,
  due_date date NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal decimal(12,2) NOT NULL DEFAULT 0,
  tax_rate decimal(5,2) NOT NULL DEFAULT 0,
  tax_amount decimal(12,2) NOT NULL DEFAULT 0,
  total decimal(12,2) NOT NULL DEFAULT 0,
  notes text,
  status text NOT NULL DEFAULT 'draft',
  version integer NOT NULL DEFAULT 1,
  original_id uuid REFERENCES invoices(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (admin functionality)
CREATE POLICY "Allow all operations on invoices"
  ON invoices
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_client_name ON invoices(client_name);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_original_id ON invoices(original_id);

-- Create sequence for auto-incrementing invoice numbers
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1;