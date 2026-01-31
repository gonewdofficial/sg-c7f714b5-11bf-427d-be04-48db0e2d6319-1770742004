-- Create venue_images table
CREATE TABLE venue_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE venue_images ENABLE ROW LEVEL SECURITY;

-- Create policies for venue_images
CREATE POLICY "Anyone can view venue images" 
  ON venue_images FOR SELECT 
  USING (true);

CREATE POLICY "Owners can manage images for their venues" 
  ON venue_images FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM venues 
      WHERE venues.id = venue_images.venue_id 
      AND venues.owner_id = auth.uid()
    )
  );

-- Create storage bucket for venue images if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('venue-images', 'venue-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Anyone can view venue images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'venue-images');

CREATE POLICY "Owners can upload venue images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'venue-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Owners can update venue images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'venue-images' 
    AND auth.uid() = owner
  );

CREATE POLICY "Owners can delete venue images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'venue-images' 
    AND auth.uid() = owner
  );