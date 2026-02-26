-- Add service_type column to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS service_type VARCHAR(50);
