-- Add stock_status column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS stock_status VARCHAR(20) DEFAULT 'available' 
CHECK (stock_status IN ('available', 'low_stock', 'out_of_stock'));

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_stock_status ON products(stock_status);
