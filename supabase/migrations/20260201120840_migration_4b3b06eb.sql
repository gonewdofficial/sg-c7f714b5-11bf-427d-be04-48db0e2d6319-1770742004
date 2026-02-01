-- Add all missing columns to venues table
DO $$ 
BEGIN
  -- Add address column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'venues' AND column_name = 'address'
  ) THEN
    ALTER TABLE venues ADD COLUMN address TEXT;
  END IF;

  -- Add city column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'venues' AND column_name = 'city'
  ) THEN
    ALTER TABLE venues ADD COLUMN city TEXT NOT NULL DEFAULT 'Unknown';
  END IF;

  -- Add region column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'venues' AND column_name = 'region'
  ) THEN
    ALTER TABLE venues ADD COLUMN region TEXT;
  END IF;

  -- Add images array column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'venues' AND column_name = 'images'
  ) THEN
    ALTER TABLE venues ADD COLUMN images TEXT[] DEFAULT '{}';
  END IF;

  -- Add price_per_night column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'venues' AND column_name = 'price_per_night'
  ) THEN
    ALTER TABLE venues ADD COLUMN price_per_night INTEGER;
  END IF;

  -- Add currency column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'venues' AND column_name = 'currency'
  ) THEN
    ALTER TABLE venues ADD COLUMN currency TEXT DEFAULT 'EUR';
  END IF;

  -- Add capacity column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'venues' AND column_name = 'capacity'
  ) THEN
    ALTER TABLE venues ADD COLUMN capacity INTEGER;
  END IF;

  -- Add amenities array column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'venues' AND column_name = 'amenities'
  ) THEN
    ALTER TABLE venues ADD COLUMN amenities TEXT[] DEFAULT '{}';
  END IF;

  -- Add features array column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'venues' AND column_name = 'features'
  ) THEN
    ALTER TABLE venues ADD COLUMN features TEXT[] DEFAULT '{}';
  END IF;

  -- Add website_url column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'venues' AND column_name = 'website_url'
  ) THEN
    ALTER TABLE venues ADD COLUMN website_url TEXT;
  END IF;

  -- Add contact_email column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'venues' AND column_name = 'contact_email'
  ) THEN
    ALTER TABLE venues ADD COLUMN contact_email TEXT;
  END IF;

  -- Add contact_phone column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'venues' AND column_name = 'contact_phone'
  ) THEN
    ALTER TABLE venues ADD COLUMN contact_phone TEXT;
  END IF;

  -- Add clothing_policy column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'venues' AND column_name = 'clothing_policy'
  ) THEN
    ALTER TABLE venues ADD COLUMN clothing_policy TEXT;
    ALTER TABLE venues ADD CONSTRAINT venues_clothing_policy_check 
      CHECK (clothing_policy IN ('fully naturist', 'clothing optional', 'textile friendly'));
  END IF;
END $$;

-- Remove default from city now that it exists
ALTER TABLE venues ALTER COLUMN city DROP DEFAULT;