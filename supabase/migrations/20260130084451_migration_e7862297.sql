-- Create venues table for property listings
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  location TEXT NOT NULL,
  country TEXT NOT NULL,
  accommodation_type TEXT NOT NULL,
  website_url TEXT,
  booking_link TEXT,
  description TEXT,
  facilities TEXT[], -- Array of facility strings
  average_rating DECIMAL(2,1) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table for star ratings
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Venues policies (public read, admin write)
CREATE POLICY "Anyone can view venues" ON venues FOR SELECT USING (true);
CREATE POLICY "Admins can insert venues" ON venues FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update venues" ON venues FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete venues" ON venues FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Reviews policies (authenticated users can create, view all)
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- Create index for slug-based lookups
CREATE INDEX IF NOT EXISTS venues_slug_idx ON venues(slug);
CREATE INDEX IF NOT EXISTS venues_country_idx ON venues(country);
CREATE INDEX IF NOT EXISTS venues_accommodation_type_idx ON venues(accommodation_type);
CREATE INDEX IF NOT EXISTS reviews_venue_id_idx ON reviews(venue_id);

-- Function to update venue rating
CREATE OR REPLACE FUNCTION update_venue_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE venues
  SET 
    average_rating = (SELECT AVG(rating) FROM reviews WHERE venue_id = NEW.venue_id),
    total_reviews = (SELECT COUNT(*) FROM reviews WHERE venue_id = NEW.venue_id)
  WHERE id = NEW.venue_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update ratings
DROP TRIGGER IF EXISTS update_venue_rating_trigger ON reviews;
CREATE TRIGGER update_venue_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_venue_rating();