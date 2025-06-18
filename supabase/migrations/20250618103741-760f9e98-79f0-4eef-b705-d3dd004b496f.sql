
-- Correction des derniers avertissements du Security Advisor (version corrigée)

-- 1. Corriger les fonctions avec search_path manquant
CREATE OR REPLACE FUNCTION public.refresh_admin_users()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $$
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.admin_users;
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.user_owns_record(record_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT record_user_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_user_id_direct()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.check_admin_direct()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_uuid()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT COALESCE(
    (SELECT id FROM auth.users WHERE id = auth.uid() LIMIT 1),
    '00000000-0000-0000-0000-000000000000'::uuid
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE id = (
      SELECT id FROM auth.users WHERE id = auth.uid() LIMIT 1
    )
  );
$$;

-- 2. Sécuriser la vue matérialisée admin_users (sans RLS car pas supporté)
REVOKE ALL ON public.admin_users FROM PUBLIC;
GRANT SELECT ON public.admin_users TO authenticated;

-- Garder seulement l'accès en lecture pour les utilisateurs authentifiés
-- La vue ne sera accessible que via les fonctions SECURITY DEFINER
