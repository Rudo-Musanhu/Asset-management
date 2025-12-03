-- Migration: Add image_url column to assets table
-- Created: 2025-12-03
-- Description: Adds optional image_url column to store asset images uploaded to Supabase Storage

-- Add image_url column if it doesn't exist
ALTER TABLE assets
ADD COLUMN IF NOT EXISTS image_url text DEFAULT NULL;

-- Optional: Add comment to document the column
COMMENT ON COLUMN assets.image_url IS 'Public URL to asset image stored in Supabase Storage';
