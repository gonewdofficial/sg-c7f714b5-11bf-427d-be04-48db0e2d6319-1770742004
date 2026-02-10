-- Add missing fields to venues table for complete functionality
ALTER TABLE venues 
ADD COLUMN IF NOT EXISTS website text,
ADD COLUMN IF NOT EXISTS contact_email text,
ADD COLUMN IF NOT EXISTS contact_phone text,
ADD COLUMN IF NOT EXISTS clothing_policy text,
ADD COLUMN IF NOT EXISTS price_per_night numeric(10,2);

-- Add check constraint for clothing_policy
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'venues_clothing_policy_check'
  ) THEN
    ALTER TABLE venues 
    ADD CONSTRAINT venues_clothing_policy_check 
    CHECK (clothing_policy IN ('fully naturist', 'clothing optional', 'textile friendly'));
  END IF;
END $$;