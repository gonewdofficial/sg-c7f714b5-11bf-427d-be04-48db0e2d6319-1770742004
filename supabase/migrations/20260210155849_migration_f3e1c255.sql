-- Add role to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'guest';

-- Add lat/lng to venues if missing (often stored as separate columns or postgis point, let's use separate columns for simplicity)
ALTER TABLE venues ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS accommodation_type TEXT; -- or use venue_type if it's the same

-- Create review_responses table if it doesn't exist
CREATE TABLE IF NOT EXISTS review_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
    response TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(review_id)
);

-- Enable RLS on review_responses
ALTER TABLE review_responses ENABLE ROW LEVEL SECURITY;

-- Policies for review_responses
CREATE POLICY "Public can view review responses" ON review_responses FOR SELECT USING (true);
CREATE POLICY "Venue owners can insert responses" ON review_responses FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM reviews
        JOIN venues ON reviews.venue_id = venues.id
        WHERE reviews.id = review_responses.review_id
        AND venues.owner_id = auth.uid()
    )
);
CREATE POLICY "Venue owners can update responses" ON review_responses FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM reviews
        JOIN venues ON reviews.venue_id = venues.id
        WHERE reviews.id = review_responses.review_id
        AND venues.owner_id = auth.uid()
    )
);
CREATE POLICY "Venue owners can delete responses" ON review_responses FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM reviews
        JOIN venues ON reviews.venue_id = venues.id
        WHERE reviews.id = review_responses.review_id
        AND venues.owner_id = auth.uid()
    )
);