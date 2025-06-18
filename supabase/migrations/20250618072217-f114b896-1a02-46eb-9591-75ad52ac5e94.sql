
-- Step 1: Clean up duplicate RLS policies
-- Remove old/duplicate policies that may conflict with the new secure ones

-- Clean up profiles table policies (keep only the new secure ones)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Clean up access_requests policies
DROP POLICY IF EXISTS "Users can view own access requests" ON public.access_requests;
DROP POLICY IF EXISTS "Users can insert own access requests" ON public.access_requests;
DROP POLICY IF EXISTS "Allow public read access to access requests" ON public.access_requests;

-- Ensure we have only the secure policies from the migration
-- (These should already exist from the previous migration, but let's ensure they're there)

-- Profiles policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'profiles_select_own'
    ) THEN
        CREATE POLICY "profiles_select_own" 
        ON public.profiles 
        FOR SELECT 
        USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'profiles_update_own'
    ) THEN
        CREATE POLICY "profiles_update_own" 
        ON public.profiles 
        FOR UPDATE 
        USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'profiles_insert_own'
    ) THEN
        CREATE POLICY "profiles_insert_own" 
        ON public.profiles 
        FOR INSERT 
        WITH CHECK (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'profiles_admin_all'
    ) THEN
        CREATE POLICY "profiles_admin_all" 
        ON public.profiles 
        FOR ALL 
        USING (public.get_current_user_role() = 'admin');
    END IF;
END $$;

-- Access requests policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'access_requests' AND policyname = 'access_requests_select_own'
    ) THEN
        CREATE POLICY "access_requests_select_own" 
        ON public.access_requests 
        FOR SELECT 
        USING (auth.uid() = user_id OR public.get_current_user_role() = 'admin');
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'access_requests' AND policyname = 'access_requests_insert_own'
    ) THEN
        CREATE POLICY "access_requests_insert_own" 
        ON public.access_requests 
        FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'access_requests' AND policyname = 'access_requests_admin_all'
    ) THEN
        CREATE POLICY "access_requests_admin_all" 
        ON public.access_requests 
        FOR ALL 
        USING (public.get_current_user_role() = 'admin');
    END IF;
END $$;

-- Step 2: Add enhanced audit logging for failed login attempts
CREATE TABLE IF NOT EXISTS public.security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID,
  ip_address INET,
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on security events
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "security_events_admin_only" 
ON public.security_events 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

-- Function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type TEXT,
  user_id UUID DEFAULT NULL,
  ip_address INET DEFAULT NULL,
  user_agent TEXT DEFAULT NULL,
  details JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.security_events (
    event_type,
    user_id,
    ip_address,
    user_agent,
    details,
    created_at
  ) VALUES (
    event_type,
    user_id,
    ip_address,
    user_agent,
    details,
    NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
