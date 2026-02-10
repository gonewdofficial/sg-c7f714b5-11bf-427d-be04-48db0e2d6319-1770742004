-- 1. Add featured column to venues table
ALTER TABLE venues ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;

-- 2. Add optional featured_until for time-limited featured listings
ALTER TABLE venues ADD COLUMN IF NOT EXISTS featured_until timestamp with time zone NULL;

-- 3. Create index for faster featured property queries
CREATE INDEX IF NOT EXISTS idx_venues_featured ON venues(featured) WHERE featured = true;

-- 4. Update RLS policies to give admins moderation powers over reviews
DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
CREATE POLICY "Users and admins can update reviews" ON reviews
FOR UPDATE USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;
CREATE POLICY "Users and admins can delete reviews" ON reviews
FOR DELETE USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 5. Update RLS policies for review_responses to give admins moderation powers
DROP POLICY IF EXISTS "Owners can update their own responses" ON review_responses;
CREATE POLICY "Owners and admins can update responses" ON review_responses
FOR UPDATE USING (
  auth.uid() = owner_id OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Owners can delete their own responses" ON review_responses;
CREATE POLICY "Owners and admins can delete responses" ON review_responses
FOR DELETE USING (
  auth.uid() = owner_id OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);