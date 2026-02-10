-- Step 1: Drop the foreign key constraint temporarily
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Step 2: Insert the profile directly
INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
VALUES (
  '3fd6e5be-e6e7-4da3-a0df-98dd0faa0a7e',
  'Blaira2022@protonmail.com',
  'Blair',
  'owner',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Step 3: Verify the profile was created
SELECT id, email, full_name, role FROM public.profiles WHERE email = 'Blaira2022@protonmail.com';