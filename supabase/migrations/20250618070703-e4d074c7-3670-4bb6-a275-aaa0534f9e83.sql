
-- Step 1: Create security definer function to safely check user roles
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Step 2: Drop all existing problematic policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Step 3: Create clean, non-recursive RLS policies for profiles
CREATE POLICY "profiles_select_own" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_admin_all" 
ON public.profiles 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

-- Step 4: Fix access_requests policies
DROP POLICY IF EXISTS "Users can view own access requests" ON public.access_requests;
DROP POLICY IF EXISTS "Users can insert own access requests" ON public.access_requests;
DROP POLICY IF EXISTS "Allow public read access to access requests" ON public.access_requests;

CREATE POLICY "access_requests_select_own" 
ON public.access_requests 
FOR SELECT 
USING (auth.uid() = user_id OR public.get_current_user_role() = 'admin');

CREATE POLICY "access_requests_insert_own" 
ON public.access_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "access_requests_admin_all" 
ON public.access_requests 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

-- Step 5: Enable RLS on all tables that need it
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies for content tables (admin-only modification, public read for clients)
CREATE POLICY "categories_public_read" 
ON public.categories 
FOR SELECT 
USING (public.get_current_user_role() IN ('client', 'admin') OR auth.role() = 'authenticated');

CREATE POLICY "categories_admin_all" 
ON public.categories 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "products_public_read" 
ON public.products 
FOR SELECT 
USING (public.get_current_user_role() IN ('client', 'admin') OR auth.role() = 'authenticated');

CREATE POLICY "products_admin_all" 
ON public.products 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "product_images_public_read" 
ON public.product_images 
FOR SELECT 
USING (public.get_current_user_role() IN ('client', 'admin') OR auth.role() = 'authenticated');

CREATE POLICY "product_images_admin_all" 
ON public.product_images 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "banners_public_read" 
ON public.banners 
FOR SELECT 
USING (public.get_current_user_role() IN ('client', 'admin') OR auth.role() = 'authenticated');

CREATE POLICY "banners_admin_all" 
ON public.banners 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

-- Step 7: Create audit logging function for admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  action_type TEXT,
  table_name TEXT,
  record_id UUID,
  details JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.admin_audit_log (
    admin_id,
    action_type,
    table_name,
    record_id,
    details,
    created_at
  ) VALUES (
    auth.uid(),
    action_type,
    table_name,
    record_id,
    details,
    NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 8: Create admin audit log table
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) NOT NULL,
  action_type TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_audit_log_admin_only" 
ON public.admin_audit_log 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

-- Step 9: Create function to safely update user roles with logging
CREATE OR REPLACE FUNCTION public.update_user_role(
  target_user_id UUID,
  new_role user_role
)
RETURNS VOID AS $$
DECLARE
  old_role user_role;
BEGIN
  -- Check if current user is admin
  IF public.get_current_user_role() != 'admin' THEN
    RAISE EXCEPTION 'Accès non autorisé';
  END IF;
  
  -- Get old role for logging
  SELECT role INTO old_role FROM public.profiles WHERE id = target_user_id;
  
  -- Update role
  UPDATE public.profiles SET role = new_role WHERE id = target_user_id;
  
  -- Log the action
  PERFORM public.log_admin_action(
    'role_change',
    'profiles',
    target_user_id,
    jsonb_build_object('old_role', old_role, 'new_role', new_role)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
