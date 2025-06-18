
-- Nettoyer les politiques existantes et recréer proprement
-- Supprimer les politiques existantes pour categories
DROP POLICY IF EXISTS "categories_public_read" ON public.categories;
DROP POLICY IF EXISTS "categories_admin_write" ON public.categories;

-- Recréer les politiques pour categories
CREATE POLICY "categories_public_read" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "categories_admin_write" 
ON public.categories 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

-- Supprimer les politiques existantes pour products si elles existent
DROP POLICY IF EXISTS "products_public_read" ON public.products;
DROP POLICY IF EXISTS "products_admin_write" ON public.products;

-- Recréer les politiques pour products
CREATE POLICY "products_public_read" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "products_admin_write" 
ON public.products 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

-- Supprimer les politiques existantes pour product_images si elles existent
DROP POLICY IF EXISTS "product_images_public_read" ON public.product_images;
DROP POLICY IF EXISTS "product_images_admin_write" ON public.product_images;

-- Recréer les politiques pour product_images
CREATE POLICY "product_images_public_read" 
ON public.product_images 
FOR SELECT 
USING (true);

CREATE POLICY "product_images_admin_write" 
ON public.product_images 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

-- Supprimer les politiques existantes pour banners si elles existent
DROP POLICY IF EXISTS "banners_public_read" ON public.banners;
DROP POLICY IF EXISTS "banners_admin_write" ON public.banners;

-- Recréer les politiques pour banners
CREATE POLICY "banners_public_read" 
ON public.banners 
FOR SELECT 
USING (true);

CREATE POLICY "banners_admin_write" 
ON public.banners 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

-- Supprimer les politiques existantes pour access_requests si elles existent
DROP POLICY IF EXISTS "access_requests_own_read" ON public.access_requests;
DROP POLICY IF EXISTS "access_requests_own_insert" ON public.access_requests;
DROP POLICY IF EXISTS "access_requests_admin_all" ON public.access_requests;

-- Recréer les politiques pour access_requests
CREATE POLICY "access_requests_own_read" 
ON public.access_requests 
FOR SELECT 
USING (auth.uid() = user_id OR public.get_current_user_role() = 'admin');

CREATE POLICY "access_requests_own_insert" 
ON public.access_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "access_requests_admin_all" 
ON public.access_requests 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

-- Supprimer les politiques existantes pour profiles si elles existent
DROP POLICY IF EXISTS "profiles_own_read" ON public.profiles;
DROP POLICY IF EXISTS "profiles_own_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_own_insert" ON public.profiles;

-- Recréer les politiques pour profiles
CREATE POLICY "profiles_own_read" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id OR public.get_current_user_role() = 'admin');

CREATE POLICY "profiles_own_update" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id OR public.get_current_user_role() = 'admin');

CREATE POLICY "profiles_own_insert" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Supprimer les politiques existantes pour admin_audit_log si elles existent
DROP POLICY IF EXISTS "admin_audit_log_admin_only" ON public.admin_audit_log;

-- Recréer les politiques pour admin_audit_log
CREATE POLICY "admin_audit_log_admin_only" 
ON public.admin_audit_log 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

-- Supprimer les politiques existantes pour security_events si elles existent
DROP POLICY IF EXISTS "security_events_admin_only" ON public.security_events;

-- Recréer les politiques pour security_events
CREATE POLICY "security_events_admin_only" 
ON public.security_events 
FOR ALL 
USING (public.get_current_user_role() = 'admin');
