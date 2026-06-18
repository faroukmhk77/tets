-- Add theme color settings to site_settings
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS theme_bg_color TEXT DEFAULT '#000000',
ADD COLUMN IF NOT EXISTS theme_primary_color TEXT DEFAULT '#C9A962',
ADD COLUMN IF NOT EXISTS theme_secondary_color TEXT DEFAULT '#1a1a1a',
ADD COLUMN IF NOT EXISTS theme_accent_color TEXT DEFAULT '#C9A962',
ADD COLUMN IF NOT EXISTS theme_text_color TEXT DEFAULT '#FFFFFF',
ADD COLUMN IF NOT EXISTS theme_button_color TEXT DEFAULT '#C9A962';

-- Add stock_deducted to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS stock_deducted BOOLEAN DEFAULT FALSE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_stock_deducted ON orders(stock_deducted);

-- Update existing settings with theme defaults
UPDATE site_settings SET
  theme_bg_color = '#000000',
  theme_primary_color = '#C9A962',
  theme_secondary_color = '#1a1a1a',
  theme_accent_color = '#C9A962',
  theme_text_color = '#FFFFFF',
  theme_button_color = '#C9A962'
WHERE theme_bg_color IS NULL;