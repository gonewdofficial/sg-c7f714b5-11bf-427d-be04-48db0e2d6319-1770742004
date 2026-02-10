-- Create SIMPLE, NON-RECURSIVE policies
CREATE POLICY "Enable read access for all users" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Enable insert for authenticated users only" 
ON public.profiles FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update for users based on id" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Verify new policies are created
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'profiles';