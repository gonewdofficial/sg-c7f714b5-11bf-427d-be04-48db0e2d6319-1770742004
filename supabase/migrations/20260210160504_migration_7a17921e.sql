-- Update inquiries table
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS check_in DATE;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS check_out DATE;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS guests INTEGER;

-- Update venues table
ALTER TABLE venues ADD COLUMN IF NOT EXISTS clothing_policy TEXT DEFAULT 'clothing-optional';

-- Add default value for venue_type if it doesn't have one (optional, but good for safety)
-- ALTER TABLE venues ALTER COLUMN venue_type SET DEFAULT 'resort';