-- Migration: Add icon_name column to assets table
-- Created: 2025-12-03
-- Description: Adds optional icon_name column to store asset icon selection from lucide-react

-- Add icon_name column if it doesn't exist
ALTER TABLE assets
ADD COLUMN IF NOT EXISTS icon_name text DEFAULT 'Package';

-- Optional: Add comment to document the column
COMMENT ON COLUMN assets.icon_name IS 'Icon name from lucide-react library (Package, Laptop, Monitor, etc.)';
