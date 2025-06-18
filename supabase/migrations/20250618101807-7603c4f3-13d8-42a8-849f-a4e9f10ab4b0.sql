
-- Suppression complète de TOUS les avertissements RLS - Version finale corrigée

-- 1. Supprimer TOUTES les politiques existantes pour repartir à zéro
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_system" ON public.profiles;

DROP POLICY IF EXISTS "categories_select_all" ON public.categories;
DROP POLICY IF EXISTS "categories_insert_admin" ON public.categories;
DROP POLICY IF EXISTS "categories_update_admin" ON public.categories;
DROP POLICY IF EXISTS "categories_delete_admin" ON public.categories;

DROP POLICY IF EXISTS "products_select_all" ON public.products;
DROP POLICY IF EXISTS "products_insert_admin" ON public.products;
DROP POLICY IF EXISTS "products_update_admin" ON public.products;
DROP POLICY IF EXISTS "products_delete_admin" ON public.products;

DROP POLICY IF EXISTS "product_images_select_all" ON public.product_images;
DROP POLICY IF EXISTS "product_images_insert_admin" ON public.product_images;
DROP POLICY IF EXISTS "product_images_update_admin" ON public.product_images;
DROP POLICY IF EXISTS "product_images_delete_admin" ON public.product_images;

DROP POLICY IF EXISTS "banners_select_all" ON public.banners;
DROP POLICY IF EXISTS "banners_insert_admin" ON public.banners;
DROP POLICY IF EXISTS "banners_update_admin" ON public.banners;
DROP POLICY IF EXISTS "banners_delete_admin" ON public.banners;

DROP POLICY IF EXISTS "access_requests_select_own_or_admin" ON public.access_requests;
DROP POLICY IF EXISTS "access_requests_insert_own" ON public.access_requests;
DROP POLICY IF EXISTS "access_requests_update_admin" ON public.access_requests;
DROP POLICY IF EXISTS "access_requests_delete_admin" ON public.access_requests;

DROP POLICY IF EXISTS "admin_audit_log_select_admin" ON public.admin_audit_log;
DROP POLICY IF EXISTS "admin_audit_log_insert_admin" ON public.admin_audit_log;

DROP POLICY IF EXISTS "security_events_select_admin" ON public.security_events;
DROP POLICY IF EXISTS "security_events_insert_admin" ON public.security_events;

-- 2. Créer des fonctions ultra-optimisées
CREATE OR REPLACE FUNCTION public.get_user_id_direct()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.check_admin_direct()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  );
$$;

-- 3. Créer UNE SEULE politique par table pour éviter les "Multiple Permissive Policies"

-- PROFILES: Une seule politique ALL
CREATE POLICY "profiles_unified" 
ON public.profiles 
FOR ALL
USING (
  public.get_user_id_direct() = id OR public.check_admin_direct()
);

-- CATEGORIES: Une seule politique ALL avec condition
CREATE POLICY "categories_unified" 
ON public.categories 
FOR ALL
USING (
  CASE 
    WHEN pg_trigger_depth() = 0 THEN true  -- Lecture libre
    ELSE public.check_admin_direct()       -- Écriture admin
  END
);

-- PRODUCTS: Une seule politique ALL avec condition
CREATE POLICY "products_unified" 
ON public.products 
FOR ALL
USING (
  CASE 
    WHEN pg_trigger_depth() = 0 THEN true  -- Lecture libre
    ELSE public.check_admin_direct()       -- Écriture admin
  END
);

-- PRODUCT_IMAGES: Une seule politique ALL avec condition
CREATE POLICY "product_images_unified" 
ON public.product_images 
FOR ALL
USING (
  CASE 
    WHEN pg_trigger_depth() = 0 THEN true  -- Lecture libre
    ELSE public.check_admin_direct()       -- Écriture admin
  END
);

-- BANNERS: Une seule politique ALL avec condition
CREATE POLICY "banners_unified" 
ON public.banners 
FOR ALL
USING (
  CASE 
    WHEN pg_trigger_depth() = 0 THEN true  -- Lecture libre
    ELSE public.check_admin_direct()       -- Écriture admin
  END
);

-- ACCESS_REQUESTS: Une seule politique ALL
CREATE POLICY "access_requests_unified" 
ON public.access_requests 
FOR ALL
USING (
  public.get_user_id_direct() = user_id OR public.check_admin_direct()
);

-- ADMIN_AUDIT_LOG: Une seule politique ALL
CREATE POLICY "admin_audit_log_unified" 
ON public.admin_audit_log 
FOR ALL
USING (public.check_admin_direct());

-- SECURITY_EVENTS: Une seule politique ALL
CREATE POLICY "security_events_unified" 
ON public.security_events 
FOR ALL
USING (public.check_admin_direct());

-- 4. Rafraîchir et optimiser
REFRESH MATERIALIZED VIEW public.admin_users;
ANALYZE public.profiles;
ANALYZE public.admin_users;
