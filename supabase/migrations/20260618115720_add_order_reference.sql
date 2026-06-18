-- Add reference column for orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS reference TEXT UNIQUE;

-- Add selected_size column (rename from size for clarity)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS selected_size TEXT;

-- Copy existing size data to selected_size
UPDATE orders SET selected_size = size WHERE selected_size IS NULL AND size IS NOT NULL;

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Ensure all tables have updated_at trigger
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();