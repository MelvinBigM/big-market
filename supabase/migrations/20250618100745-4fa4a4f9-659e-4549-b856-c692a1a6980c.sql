
-- Correction du problème de récursion infinie dans les politiques profiles
-- et optimisation finale des politiques RLS

-- D'abord, supprimer toutes les politiques profiles qui causent la récursion
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;

-- Recréer les politiques profiles sans récursion
CREATE POLICY "profiles_select_own_or_admin" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = id OR 
  public.get_current_user_role() = 'admin'
);

CREATE POLICY "profiles_update_own_or_admin" 
ON public.profiles 
FOR UPDATE 
USING (
  auth.uid() = id OR 
  public.get_current_user_role() = 'admin'
);

CREATE POLICY "profiles_insert_own" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Maintenant optimiser les autres tables en utilisant la fonction existante
-- au lieu des requêtes EXISTS qui sont moins efficaces

-- Categories
DROP POLICY IF EXISTS "categories_insert_admin" ON public.categories;
DROP POLICY IF EXISTS "categories_update_admin" ON public.categories;
DROP POLICY IF EXISTS "categories_delete_admin" ON public.categories;

CREATE POLICY "categories_insert_admin" 
ON public.categories 
FOR INSERT 
WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY "categories_update_admin" 
ON public.categories 
FOR UPDATE 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "categories_delete_admin" 
ON public.categories 
FOR DELETE 
USING (public.get_current_user_role() = 'admin');

-- Products
DROP POLICY IF EXISTS "products_insert_admin" ON public.products;
DROP POLICY IF EXISTS "products_update_admin" ON public.products;
DROP POLICY IF EXISTS "products_delete_admin" ON public.products;

CREATE POLICY "products_insert_admin" 
ON public.products 
FOR INSERT 
WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY "products_update_admin" 
ON public.products 
FOR UPDATE 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "products_delete_admin" 
ON public.products 
FOR DELETE 
USING (public.get_current_user_role() = 'admin');

-- Product Images
DROP POLICY IF EXISTS "product_images_insert_admin" ON public.product_images;
DROP POLICY IF EXISTS "product_images_update_admin" ON public.product_images;
DROP POLICY IF EXISTS "product_images_delete_admin" ON public.product_images;

CREATE POLICY "product_images_insert_admin" 
ON public.product_images 
FOR INSERT 
WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY "product_images_update_admin" 
ON public.product_images 
FOR UPDATE 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "product_images_delete_admin" 
ON public.product_images 
FOR DELETE 
USING (public.get_current_user_role() = 'admin');

-- Banners
DROP POLICY IF EXISTS "banners_insert_admin" ON public.banners;
DROP POLICY IF EXISTS "banners_update_admin" ON public.banners;
DROP POLICY IF EXISTS "banners_delete_admin" ON public.banners;

CREATE POLICY "banners_insert_admin" 
ON public.banners 
FOR INSERT 
WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY "banners_update_admin" 
ON public.banners 
FOR UPDATE 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "banners_delete_admin" 
ON public.banners 
FOR DELETE 
USING (public.get_current_user_role() = 'admin');

-- Access Requests - garder auth.uid() pour user_id mais utiliser la fonction pour admin
DROP POLICY IF EXISTS "access_requests_select_own_or_admin" ON public.access_requests;
DROP POLICY IF EXISTS "access_requests_update_admin" ON public.access_requests;
DROP POLICY IF EXISTS "access_requests_delete_admin" ON public.access_requests;

CREATE POLICY "access_requests_select_own_or_admin" 
ON public.access_requests 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  public.get_current_user_role() = 'admin'
);

CREATE POLICY "access_requests_update_admin" 
ON public.access_requests 
FOR UPDATE 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "access_requests_delete_admin" 
ON public.access_requests 
FOR DELETE 
USING (public.get_current_user_role() = 'admin');

-- Admin Audit Log
DROP POLICY IF EXISTS "admin_audit_log_select_admin" ON public.admin_audit_log;
DROP POLICY IF EXISTS "admin_audit_log_insert_admin" ON public.admin_audit_log;

CREATE POLICY "admin_audit_log_select_admin" 
ON public.admin_audit_log 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "admin_audit_log_insert_admin" 
ON public.admin_audit_log 
FOR INSERT 
WITH CHECK (public.get_current_user_role() = 'admin');

-- Security Events
DROP POLICY IF EXISTS "security_events_select_admin" ON public.security_events;
DROP POLICY IF EXISTS "security_events_insert_admin" ON public.security_events;

CREATE POLICY "security_events_select_admin" 
ON public.security_events 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "security_events_insert_admin" 
ON public.security_events 
FOR INSERT 
WITH CHECK (public.get_current_user_role() = 'admin');
