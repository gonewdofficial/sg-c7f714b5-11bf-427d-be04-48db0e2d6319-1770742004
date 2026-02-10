-- DISABLE RLS completely on profiles table to stop the recursion
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'profiles';