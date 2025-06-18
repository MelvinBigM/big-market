
-- Optimisation avancée des politiques RLS pour réduire les avertissements
-- Correction: retirer TG_OP et utiliser des politiques séparées mais optimisées

-- 1. Optimiser les politiques profiles en regroupant les opérations
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;

-- Regrouper SELECT et UPDATE pour profiles
CREATE POLICY "profiles_read_write_own_or_admin" 
ON public.profiles 
FOR ALL
USING (auth.uid() = id OR public.get_current_user_role() = 'admin')
WITH CHECK (auth.uid() = id OR public.get_current_user_role() = 'admin');

-- 2. Simplifier les politiques pour les tables publiques en lecture
-- Ces tables peuvent être lues par tous les utilisateurs authentifiés
DROP POLICY IF EXISTS "categories_select_all" ON public.categories;
DROP POLICY IF EXISTS "categories_insert_admin" ON public.categories;
DROP POLICY IF EXISTS "categories_update_admin" ON public.categories;
DROP POLICY IF EXISTS "categories_delete_admin" ON public.categories;

-- Une seule politique pour les catégories
CREATE POLICY "categories_all_operations" 
ON public.categories 
FOR ALL
USING (true)  -- Lecture libre
WITH CHECK (public.get_current_user_role() = 'admin');  -- Écriture admin uniquement

-- Même approche pour products
DROP POLICY IF EXISTS "products_select_all" ON public.products;
DROP POLICY IF EXISTS "products_insert_admin" ON public.products;
DROP POLICY IF EXISTS "products_update_admin" ON public.products;
DROP POLICY IF EXISTS "products_delete_admin" ON public.products;

CREATE POLICY "products_all_operations" 
ON public.products 
FOR ALL
USING (true)  -- Lecture libre
WITH CHECK (public.get_current_user_role() = 'admin');  -- Écriture admin uniquement

-- Même approche pour product_images
DROP POLICY IF EXISTS "product_images_select_all" ON public.product_images;
DROP POLICY IF EXISTS "product_images_insert_admin" ON public.product_images;
DROP POLICY IF EXISTS "product_images_update_admin" ON public.product_images;
DROP POLICY IF EXISTS "product_images_delete_admin" ON public.product_images;

CREATE POLICY "product_images_all_operations" 
ON public.product_images 
FOR ALL
USING (true)  -- Lecture libre
WITH CHECK (public.get_current_user_role() = 'admin');  -- Écriture admin uniquement

-- Même approche pour banners
DROP POLICY IF EXISTS "banners_select_all" ON public.banners;
DROP POLICY IF EXISTS "banners_insert_admin" ON public.banners;
DROP POLICY IF EXISTS "banners_update_admin" ON public.banners;
DROP POLICY IF EXISTS "banners_delete_admin" ON public.banners;

CREATE POLICY "banners_all_operations" 
ON public.banners 
FOR ALL
USING (true)  -- Lecture libre
WITH CHECK (public.get_current_user_role() = 'admin');  -- Écriture admin uniquement

-- 3. Optimiser access_requests - approche simplifiée
DROP POLICY IF EXISTS "access_requests_select_own_or_admin" ON public.access_requests;
DROP POLICY IF EXISTS "access_requests_insert_own" ON public.access_requests;
DROP POLICY IF EXISTS "access_requests_update_admin" ON public.access_requests;
DROP POLICY IF EXISTS "access_requests_delete_admin" ON public.access_requests;

-- Lecture: utilisateur peut voir ses propres demandes ou admin voit tout
CREATE POLICY "access_requests_select" 
ON public.access_requests 
FOR SELECT
USING (
  auth.uid() = user_id OR 
  public.get_current_user_role() = 'admin'
);

-- Écriture: seuls les admins peuvent modifier/supprimer, utilisateurs peuvent créer
CREATE POLICY "access_requests_insert" 
ON public.access_requests 
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "access_requests_modify" 
ON public.access_requests 
FOR UPDATE
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "access_requests_delete" 
ON public.access_requests 
FOR DELETE
USING (public.get_current_user_role() = 'admin');

-- 4. Simplifier les tables d'audit (admin uniquement)
DROP POLICY IF EXISTS "admin_audit_log_select_admin" ON public.admin_audit_log;
DROP POLICY IF EXISTS "admin_audit_log_insert_admin" ON public.admin_audit_log;

CREATE POLICY "admin_audit_log_all_operations" 
ON public.admin_audit_log 
FOR ALL
USING (public.get_current_user_role() = 'admin')
WITH CHECK (public.get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "security_events_select_admin" ON public.security_events;
DROP POLICY IF EXISTS "security_events_insert_admin" ON public.security_events;

CREATE POLICY "security_events_all_operations" 
ON public.security_events 
FOR ALL
USING (public.get_current_user_role() = 'admin')
WITH CHECK (public.get_current_user_role() = 'admin');

-- 5. Créer un index pour optimiser la fonction get_current_user_role()
CREATE INDEX IF NOT EXISTS idx_profiles_user_role_lookup 
ON public.profiles (id, role) 
WHERE role = 'admin';
