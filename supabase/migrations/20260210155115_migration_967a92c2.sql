-- Create enum types for venue categories and amenities
CREATE TYPE venue_type AS ENUM ('hotel', 'resort', 'campground', 'beach_club', 'spa');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE inquiry_status AS ENUM ('pending', 'answered', 'closed');

-- Create venues table
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  venue_type venue_type NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  price_per_night DECIMAL(10, 2) NOT NULL,
  max_guests INTEGER NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  rules TEXT[] DEFAULT '{}',
  check_in_time TIME NOT NULL DEFAULT '14:00',
  check_out_time TIME NOT NULL DEFAULT '11:00',
  is_active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create venue_images table
CREATE TABLE venue_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  num_guests INTEGER NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status booking_status DEFAULT 'pending',
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  location_rating INTEGER CHECK (location_rating >= 1 AND location_rating <= 5),
  value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
  comment TEXT,
  owner_response TEXT,
  owner_response_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(booking_id)
);

-- Create inquiries table
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status inquiry_status DEFAULT 'pending',
  owner_response TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_venues_owner ON venues(owner_id);
CREATE INDEX idx_venues_location ON venues(city, country);
CREATE INDEX idx_venues_active ON venues(is_active);
CREATE INDEX idx_venue_images_venue ON venue_images(venue_id);
CREATE INDEX idx_bookings_venue ON bookings(venue_id);
CREATE INDEX idx_bookings_guest ON bookings(guest_id);
CREATE INDEX idx_bookings_dates ON bookings(check_in_date, check_out_date);
CREATE INDEX idx_reviews_venue ON reviews(venue_id);
CREATE INDEX idx_inquiries_venue ON inquiries(venue_id);
CREATE INDEX idx_inquiries_guest ON inquiries(guest_id);

-- Enable RLS on all tables
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Venues RLS Policies
CREATE POLICY "Anyone can view active venues" ON venues FOR SELECT USING (is_active = true);
CREATE POLICY "Owners can view their own venues" ON venues FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Authenticated users can create venues" ON venues FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update their own venues" ON venues FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners can delete their own venues" ON venues FOR DELETE USING (auth.uid() = owner_id);

-- Venue Images RLS Policies
CREATE POLICY "Anyone can view venue images" ON venue_images FOR SELECT USING (
  EXISTS (SELECT 1 FROM venues WHERE venues.id = venue_images.venue_id AND venues.is_active = true)
);
CREATE POLICY "Owners can manage their venue images" ON venue_images FOR ALL USING (
  EXISTS (SELECT 1 FROM venues WHERE venues.id = venue_images.venue_id AND venues.owner_id = auth.uid())
);

-- Bookings RLS Policies
CREATE POLICY "Users can view their own bookings as guests" ON bookings FOR SELECT USING (auth.uid() = guest_id);
CREATE POLICY "Owners can view bookings for their venues" ON bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM venues WHERE venues.id = bookings.venue_id AND venues.owner_id = auth.uid())
);
CREATE POLICY "Authenticated users can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = guest_id);
CREATE POLICY "Guests can update their own bookings" ON bookings FOR UPDATE USING (auth.uid() = guest_id);
CREATE POLICY "Owners can update bookings for their venues" ON bookings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM venues WHERE venues.id = bookings.venue_id AND venues.owner_id = auth.uid())
);

-- Reviews RLS Policies
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Guests can create reviews for their bookings" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owners can respond to reviews for their venues" ON reviews FOR UPDATE USING (
  EXISTS (SELECT 1 FROM venues WHERE venues.id = reviews.venue_id AND venues.owner_id = auth.uid())
);

-- Inquiries RLS Policies
CREATE POLICY "Guests can view their own inquiries" ON inquiries FOR SELECT USING (auth.uid() = guest_id);
CREATE POLICY "Owners can view inquiries for their venues" ON inquiries FOR SELECT USING (
  EXISTS (SELECT 1 FROM venues WHERE venues.id = inquiries.venue_id AND venues.owner_id = auth.uid())
);
CREATE POLICY "Authenticated users can create inquiries" ON inquiries FOR INSERT WITH CHECK (auth.uid() = guest_id);
CREATE POLICY "Owners can respond to inquiries" ON inquiries FOR UPDATE USING (
  EXISTS (SELECT 1 FROM venues WHERE venues.id = inquiries.venue_id AND venues.owner_id = auth.uid())
);