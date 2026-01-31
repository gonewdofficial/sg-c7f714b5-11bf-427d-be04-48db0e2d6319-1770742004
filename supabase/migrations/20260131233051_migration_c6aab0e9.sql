-- Drop ALL existing policies on profiles to stop the recursion
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Verify all policies are dropped
SELECT policyname FROM pg_policies WHERE tablename = 'profiles';