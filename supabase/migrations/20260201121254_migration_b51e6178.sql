-- Make location column nullable since we're using city now
ALTER TABLE venues ALTER COLUMN location DROP NOT NULL;