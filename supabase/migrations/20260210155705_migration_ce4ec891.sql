ALTER TABLE venues ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS booking_link TEXT;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Add unique constraint to slug if it doesn't exist (handled by error ignoring or check)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'venues_slug_key') THEN
        ALTER TABLE venues ADD CONSTRAINT venues_slug_key UNIQUE (slug);
    END IF;
END
$$;