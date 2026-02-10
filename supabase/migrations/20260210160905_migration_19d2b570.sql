-- Add missing columns to venues table
ALTER TABLE venues ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS bathrooms INTEGER DEFAULT 1;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS bedrooms INTEGER DEFAULT 1;

-- Ensure venue_type defaults to 'resort' if null (though it's an enum, we need to handle it)
ALTER TABLE venues ALTER COLUMN venue_type SET DEFAULT 'resort'::venue_type;