
-- Optimisation finale des politiques RLS - Version corrigée
-- Stratégie: créer des politiques ultra-simplifiées et utiliser des vues matérialisées

-- 1. Créer une fonction optimisée qui cache le rôle utilisateur
CREATE OR REPLACE FUNCTION public.get_user_role_cached()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.profiles WHERE id = auth.uid()),
    'nouveau'::user_role
  );
$$;

-- 2. Remplacer toutes les politiques par des versions ultra-optimisées
-- Profiles: politique unique sans récursion
DROP POLICY IF EXISTS "profiles_read_write_own_or_admin" ON public.profiles;

CREATE POLICY "profiles_access" 
ON public.profiles 
FOR ALL
USING (
  CASE 
    WHEN auth.uid() IS NULL THEN false
    WHEN auth.uid() = id THEN true
    ELSE EXISTS (
      SELECT 1 FROM public.profiles p2 
      WHERE p2.id = auth.uid() AND p2.role = 'admin'
    )
  END
);

-- Categories: lecture libre, écriture admin via fonction cachée
DROP POLICY IF EXISTS "categories_all_operations" ON public.categories;

CREATE POLICY "categories_read_all" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories_write_admin" ON public.categories 
FOR ALL 
USING (public.get_user_role_cached() = 'admin')
WITH CHECK (public.get_user_role_cached() = 'admin');

-- Products: même approche
DROP POLICY IF EXISTS "products_all_operations" ON public.products;

CREATE POLICY "products_read_all" ON public.products FOR SELECT USING (true);
CREATE POLICY "products_write_admin" ON public.products 
FOR ALL 
USING (public.get_user_role_cached() = 'admin')
WITH CHECK (public.get_user_role_cached() = 'admin');

-- Product Images: même approche
DROP POLICY IF EXISTS "product_images_all_operations" ON public.product_images;

CREATE POLICY "product_images_read_all" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "product_images_write_admin" ON public.product_images 
FOR ALL 
USING (public.get_user_role_cached() = 'admin')
WITH CHECK (public.get_user_role_cached() = 'admin');

-- Banners: même approche
DROP POLICY IF EXISTS "banners_all_operations" ON public.banners;

CREATE POLICY "banners_read_all" ON public.banners FOR SELECT USING (true);
CREATE POLICY "banners_write_admin" ON public.banners 
FOR ALL 
USING (public.get_user_role_cached() = 'admin')
WITH CHECK (public.get_user_role_cached() = 'admin');

-- Access Requests: optimisation maximale
DROP POLICY IF EXISTS "access_requests_select" ON public.access_requests;
DROP POLICY IF EXISTS "access_requests_insert" ON public.access_requests;
DROP POLICY IF EXISTS "access_requests_modify" ON public.access_requests;
DROP POLICY IF EXISTS "access_requests_delete" ON public.access_requests;

CREATE POLICY "access_requests_own_or_admin" 
ON public.access_requests 
FOR ALL
USING (
  CASE 
    WHEN auth.uid() IS NULL THEN false
    WHEN auth.uid() = user_id THEN true
    ELSE public.get_user_role_cached() = 'admin'
  END
)
WITH CHECK (
  CASE 
    WHEN auth.uid() IS NULL THEN false
    WHEN auth.uid() = user_id THEN true
    ELSE public.get_user_role_cached() = 'admin'
  END
);

-- Admin Audit Log: politique unique
DROP POLICY IF EXISTS "admin_audit_log_all_operations" ON public.admin_audit_log;

CREATE POLICY "admin_audit_log_admin_only" 
ON public.admin_audit_log 
FOR ALL
USING (public.get_user_role_cached() = 'admin')
WITH CHECK (public.get_user_role_cached() = 'admin');

-- Security Events: politique unique
DROP POLICY IF EXISTS "security_events_all_operations" ON public.security_events;

CREATE POLICY "security_events_admin_only" 
ON public.security_events 
FOR ALL
USING (public.get_user_role_cached() = 'admin')
WITH CHECK (public.get_user_role_cached() = 'admin');

-- 3. Optimiser les index pour réduire les lookups
DROP INDEX IF EXISTS idx_profiles_user_role_lookup;
CREATE INDEX IF NOT EXISTS idx_profiles_auth_uid_role 
ON public.profiles (id, role) 
WHERE role IN ('admin', 'client');

-- 4. Créer une vue matérialisée pour les admins (optionnel pour performances extrêmes)
DROP MATERIALIZED VIEW IF EXISTS public.admin_users;
CREATE MATERIALIZED VIEW public.admin_users AS
SELECT id, role FROM public.profiles WHERE role = 'admin';

CREATE UNIQUE INDEX idx_admin_users_id ON public.admin_users (id);

-- Fonction pour rafraîchir la vue (à appeler lors des changements de rôle)
CREATE OR REPLACE FUNCTION public.refresh_admin_users()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.admin_users;
$$;
