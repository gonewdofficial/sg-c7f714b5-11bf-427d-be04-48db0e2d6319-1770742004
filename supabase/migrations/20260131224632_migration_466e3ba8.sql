-- Add owner_id to venues table to link venues with their owners
ALTER TABLE venues ADD COLUMN owner_id uuid REFERENCES profiles(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX venues_owner_id_idx ON venues(owner_id);

-- Create review_responses table for owners to respond to reviews
CREATE TABLE review_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  response text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes
CREATE INDEX review_responses_review_id_idx ON review_responses(review_id);
CREATE INDEX review_responses_owner_id_idx ON review_responses(owner_id);

-- Enable RLS
ALTER TABLE review_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for review_responses
CREATE POLICY "Anyone can view review responses" ON review_responses FOR SELECT USING (true);
CREATE POLICY "Owners can create responses" ON review_responses FOR INSERT WITH CHECK (
  auth.uid() = owner_id AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'owner')
);
CREATE POLICY "Owners can update their own responses" ON review_responses FOR UPDATE USING (
  auth.uid() = owner_id
);
CREATE POLICY "Owners can delete their own responses" ON review_responses FOR DELETE USING (
  auth.uid() = owner_id
);

-- Update venues RLS policies to allow owners to manage their own venues
DROP POLICY IF EXISTS "Admins can insert venues" ON venues;
DROP POLICY IF EXISTS "Admins can update venues" ON venues;
DROP POLICY IF EXISTS "Admins can delete venues" ON venues;

CREATE POLICY "Admins and owners can insert venues" ON venues FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'owner'))
);

CREATE POLICY "Admins can update any venue, owners can update their own" ON venues FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') OR
  (auth.uid() = owner_id AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'owner'))
);

CREATE POLICY "Admins can delete any venue, owners can delete their own" ON venues FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') OR
  (auth.uid() = owner_id AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'owner'))
);