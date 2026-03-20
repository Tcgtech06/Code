-- Add HSN code and balance fields to invoices table
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS hsn_code TEXT,
ADD COLUMN IF NOT EXISTS client_phone TEXT,
ADD COLUMN IF NOT EXISTS paid_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS balance DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS show_balance BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS gst_type TEXT DEFAULT 'IGST',
ADD COLUMN IF NOT EXISTS sgst_rate DECIMAL(5,2) DEFAULT 9.00,
ADD COLUMN IF NOT EXISTS cgst_rate DECIMAL(5,2) DEFAULT 9.00,
ADD COLUMN IF NOT EXISTS igst_rate DECIMAL(5,2) DEFAULT 18.00,
ADD COLUMN IF NOT EXISTS sgst_amount DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS cgst_amount DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS igst_amount DECIMAL(10,2) DEFAULT 0.00;

-- Add comment for documentation
COMMENT ON COLUMN invoices.hsn_code IS 'HSN (Harmonized System of Nomenclature) code for the service';
COMMENT ON COLUMN invoices.client_phone IS 'Client mobile/phone number';
COMMENT ON COLUMN invoices.paid_amount IS 'Amount paid by client (partial payment)';
COMMENT ON COLUMN invoices.balance IS 'Remaining balance amount (total - paid_amount)';
COMMENT ON COLUMN invoices.show_balance IS 'Whether to show balance section in invoice';
COMMENT ON COLUMN invoices.gst_type IS 'Type of GST: IGST for inter-state, SGST_CGST for intra-state';
COMMENT ON COLUMN invoices.sgst_rate IS 'State GST rate percentage';
COMMENT ON COLUMN invoices.cgst_rate IS 'Central GST rate percentage';
COMMENT ON COLUMN invoices.igst_rate IS 'Integrated GST rate percentage';
COMMENT ON COLUMN invoices.sgst_amount IS 'Calculated SGST amount';
COMMENT ON COLUMN invoices.cgst_amount IS 'Calculated CGST amount';
COMMENT ON COLUMN invoices.igst_amount IS 'Calculated IGST amount';