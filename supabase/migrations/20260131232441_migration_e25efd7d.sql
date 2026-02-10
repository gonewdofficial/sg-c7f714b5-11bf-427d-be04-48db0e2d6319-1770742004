-- First, let's drop the problematic constraint again
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Verify the auth.users table exists and has the user
SELECT COUNT(*) as user_exists 
FROM auth.users 
WHERE id = '3fd6e5be-e6e7-4da3-a0df-98dd0faa0a7e';