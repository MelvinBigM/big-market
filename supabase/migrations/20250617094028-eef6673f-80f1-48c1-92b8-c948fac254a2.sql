
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Create simpler policies without recursion
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Enable RLS on access_requests table and create policies
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own access requests" 
ON public.access_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own access requests" 
ON public.access_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow public read access to access requests" 
ON public.access_requests 
FOR SELECT 
USING (true);
