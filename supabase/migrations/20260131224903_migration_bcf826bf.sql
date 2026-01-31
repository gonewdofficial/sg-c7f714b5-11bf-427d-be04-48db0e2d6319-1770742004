-- Add status column to venues table
ALTER TABLE venues ADD COLUMN status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived'));

-- Create index for status
CREATE INDEX venues_status_idx ON venues(status);