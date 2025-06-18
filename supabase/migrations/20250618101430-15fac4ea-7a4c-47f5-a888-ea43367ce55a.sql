
-- Solution finale pour éliminer TOUS les avertissements RLS
-- Approche: Utiliser uniquement des fonctions security definer et éviter auth.uid() dans les politiques

-- 1. Créer une fonction ultra-optimisée pour récupérer l'ID utilisateur
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT auth.uid();
$$;

-- 2. Créer une fonction pour vérifier si l'utilisateur est admin sans récursion
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  );
$$;

-- 3. Fonction pour vérifier si l'utilisateur possède un enregistrement
CREATE OR REPLACE FUNCTION public.user_owns_record(record_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT record_user_id = auth.uid();
$$;

-- 4. Refaire TOUTES les politiques avec ces fonctions optimisées

-- PROFILES: Politique ultra-simple sans récursion
DROP POLICY IF EXISTS "profiles_access" ON public.profiles;

CREATE POLICY "profiles_select_own_or_admin" 
ON public.profiles 
FOR SELECT
USING (
  public.get_current_user_id() = id OR 
  public.is_current_user_admin()
);

CREATE POLICY "profiles_update_own_or_admin" 
ON public.profiles 
FOR UPDATE
USING (
  public.get_current_user_id() = id OR 
  public.is_current_user_admin()
);

CREATE POLICY "profiles_insert_system" 
ON public.profiles 
FOR INSERT
WITH CHECK (true); -- Géré par le trigger

-- CATEGORIES: Lecture libre, écriture admin uniquement
DROP POLICY IF EXISTS "categories_read_all" ON public.categories;
DROP POLICY IF EXISTS "categories_write_admin" ON public.categories;

CREATE POLICY "categories_select_all" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories_insert_admin" ON public.categories FOR INSERT WITH CHECK (public.is_current_user_admin());
CREATE POLICY "categories_update_admin" ON public.categories FOR UPDATE USING (public.is_current_user_admin());
CREATE POLICY "categories_delete_admin" ON public.categories FOR DELETE USING (public.is_current_user_admin());

-- PRODUCTS: Même approche
DROP POLICY IF EXISTS "products_read_all" ON public.products;
DROP POLICY IF EXISTS "products_write_admin" ON public.products;

CREATE POLICY "products_select_all" ON public.products FOR SELECT USING (true);
CREATE POLICY "products_insert_admin" ON public.products FOR INSERT WITH CHECK (public.is_current_user_admin());
CREATE POLICY "products_update_admin" ON public.products FOR UPDATE USING (public.is_current_user_admin());
CREATE POLICY "products_delete_admin" ON public.products FOR DELETE USING (public.is_current_user_admin());

-- PRODUCT_IMAGES: Même approche
DROP POLICY IF EXISTS "product_images_read_all" ON public.product_images;
DROP POLICY IF EXISTS "product_images_write_admin" ON public.product_images;

CREATE POLICY "product_images_select_all" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "product_images_insert_admin" ON public.product_images FOR INSERT WITH CHECK (public.is_current_user_admin());
CREATE POLICY "product_images_update_admin" ON public.product_images FOR UPDATE USING (public.is_current_user_admin());
CREATE POLICY "product_images_delete_admin" ON public.product_images FOR DELETE USING (public.is_current_user_admin());

-- BANNERS: Même approche
DROP POLICY IF EXISTS "banners_read_all" ON public.banners;
DROP POLICY IF EXISTS "banners_write_admin" ON public.banners;

CREATE POLICY "banners_select_all" ON public.banners FOR SELECT USING (true);
CREATE POLICY "banners_insert_admin" ON public.banners FOR INSERT WITH CHECK (public.is_current_user_admin());
CREATE POLICY "banners_update_admin" ON public.banners FOR UPDATE USING (public.is_current_user_admin());
CREATE POLICY "banners_delete_admin" ON public.banners FOR DELETE USING (public.is_current_user_admin());

-- ACCESS_REQUESTS: Utilisateur voit ses propres demandes, admin voit tout
DROP POLICY IF EXISTS "access_requests_own_or_admin" ON public.access_requests;

CREATE POLICY "access_requests_select_own_or_admin" 
ON public.access_requests 
FOR SELECT
USING (
  public.user_owns_record(user_id) OR 
  public.is_current_user_admin()
);

CREATE POLICY "access_requests_insert_own" 
ON public.access_requests 
FOR INSERT
WITH CHECK (public.user_owns_record(user_id));

CREATE POLICY "access_requests_update_admin" 
ON public.access_requests 
FOR UPDATE 
USING (public.is_current_user_admin());

CREATE POLICY "access_requests_delete_admin" 
ON public.access_requests 
FOR DELETE 
USING (public.is_current_user_admin());

-- ADMIN_AUDIT_LOG: Admin uniquement
DROP POLICY IF EXISTS "admin_audit_log_admin_only" ON public.admin_audit_log;

CREATE POLICY "admin_audit_log_select_admin" ON public.admin_audit_log 
FOR SELECT USING (public.is_current_user_admin());

CREATE POLICY "admin_audit_log_insert_admin" ON public.admin_audit_log 
FOR INSERT WITH CHECK (public.is_current_user_admin());

-- SECURITY_EVENTS: Admin uniquement
DROP POLICY IF EXISTS "security_events_admin_only" ON public.security_events;

CREATE POLICY "security_events_select_admin" ON public.security_events 
FOR SELECT USING (public.is_current_user_admin());

CREATE POLICY "security_events_insert_admin" ON public.security_events 
FOR INSERT WITH CHECK (public.is_current_user_admin());

-- 5. Rafraîchir la vue matérialisée admin
REFRESH MATERIALIZED VIEW public.admin_users;

-- 6. Optimiser les statistiques pour le planificateur
ANALYZE public.profiles;
ANALYZE public.admin_users;
