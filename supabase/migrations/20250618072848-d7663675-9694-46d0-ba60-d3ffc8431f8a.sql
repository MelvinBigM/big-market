
-- Fix security issues identified in the Security Advisor

-- 1. Fix Function Search Path Mutable issues by setting search_path explicitly
-- Update get_current_user_role function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = 'public';

-- Update log_admin_action function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Update update_user_role function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Update log_security_event function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- 2. Enable leaked password protection (this is a Supabase Auth setting)
-- This will be handled at the Supabase project level, not via SQL

-- 3. Configure OTP expiry to recommended settings
-- This is also handled at the Supabase Auth configuration level
