
-- Nouvelle migration pour optimiser les politiques RLS
-- Gestion sécurisée des politiques existantes

-- Categories : optimisation complète
DROP POLICY IF EXISTS "categories_select_all" ON public.categories;
DROP POLICY IF EXISTS "categories_insert_admin" ON public.categories;
DROP POLICY IF EXISTS "categories_update_admin" ON public.categories;
DROP POLICY IF EXISTS "categories_delete_admin" ON public.categories;
DROP POLICY IF EXISTS "categories_public_read" ON public.categories;
DROP POLICY IF EXISTS "categories_admin_write" ON public.categories;

CREATE POLICY "categories_select_all" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "categories_insert_admin" 
ON public.categories 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "categories_update_admin" 
ON public.categories 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "categories_delete_admin" 
ON public.categories 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Products : optimisation complète
DROP POLICY IF EXISTS "products_select_all" ON public.products;
DROP POLICY IF EXISTS "products_insert_admin" ON public.products;
DROP POLICY IF EXISTS "products_update_admin" ON public.products;
DROP POLICY IF EXISTS "products_delete_admin" ON public.products;
DROP POLICY IF EXISTS "products_public_read" ON public.products;
DROP POLICY IF EXISTS "products_admin_write" ON public.products;

CREATE POLICY "products_select_all" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "products_insert_admin" 
ON public.products 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "products_update_admin" 
ON public.products 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "products_delete_admin" 
ON public.products 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Product Images : optimisation complète
DROP POLICY IF EXISTS "product_images_select_all" ON public.product_images;
DROP POLICY IF EXISTS "product_images_insert_admin" ON public.product_images;
DROP POLICY IF EXISTS "product_images_update_admin" ON public.product_images;
DROP POLICY IF EXISTS "product_images_delete_admin" ON public.product_images;
DROP POLICY IF EXISTS "product_images_public_read" ON public.product_images;
DROP POLICY IF EXISTS "product_images_admin_write" ON public.product_images;

CREATE POLICY "product_images_select_all" 
ON public.product_images 
FOR SELECT 
USING (true);

CREATE POLICY "product_images_insert_admin" 
ON public.product_images 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "product_images_update_admin" 
ON public.product_images 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "product_images_delete_admin" 
ON public.product_images 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Banners : optimisation complète
DROP POLICY IF EXISTS "banners_select_all" ON public.banners;
DROP POLICY IF EXISTS "banners_insert_admin" ON public.banners;
DROP POLICY IF EXISTS "banners_update_admin" ON public.banners;
DROP POLICY IF EXISTS "banners_delete_admin" ON public.banners;
DROP POLICY IF EXISTS "banners_public_read" ON public.banners;
DROP POLICY IF EXISTS "banners_admin_write" ON public.banners;

CREATE POLICY "banners_select_all" 
ON public.banners 
FOR SELECT 
USING (true);

CREATE POLICY "banners_insert_admin" 
ON public.banners 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "banners_update_admin" 
ON public.banners 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "banners_delete_admin" 
ON public.banners 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Access Requests : optimisation complète
DROP POLICY IF EXISTS "access_requests_select_own_or_admin" ON public.access_requests;
DROP POLICY IF EXISTS "access_requests_insert_own" ON public.access_requests;
DROP POLICY IF EXISTS "access_requests_update_admin" ON public.access_requests;
DROP POLICY IF EXISTS "access_requests_delete_admin" ON public.access_requests;
DROP POLICY IF EXISTS "access_requests_own_read" ON public.access_requests;
DROP POLICY IF EXISTS "access_requests_own_insert" ON public.access_requests;
DROP POLICY IF EXISTS "access_requests_admin_all" ON public.access_requests;

CREATE POLICY "access_requests_select_own_or_admin" 
ON public.access_requests 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "access_requests_insert_own" 
ON public.access_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "access_requests_update_admin" 
ON public.access_requests 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "access_requests_delete_admin" 
ON public.access_requests 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Profiles : optimisation complète
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_own_read" ON public.profiles;
DROP POLICY IF EXISTS "profiles_own_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_own_insert" ON public.profiles;

CREATE POLICY "profiles_select_own_or_admin" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = id OR 
  EXISTS (
    SELECT 1 FROM public.profiles p2 
    WHERE p2.id = auth.uid() AND p2.role = 'admin'
  )
);

CREATE POLICY "profiles_update_own_or_admin" 
ON public.profiles 
FOR UPDATE 
USING (
  auth.uid() = id OR 
  EXISTS (
    SELECT 1 FROM public.profiles p2 
    WHERE p2.id = auth.uid() AND p2.role = 'admin'
  )
);

CREATE POLICY "profiles_insert_own" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Admin Audit Log : optimisation complète
DROP POLICY IF EXISTS "admin_audit_log_select_admin" ON public.admin_audit_log;
DROP POLICY IF EXISTS "admin_audit_log_insert_admin" ON public.admin_audit_log;
DROP POLICY IF EXISTS "admin_audit_log_admin_only" ON public.admin_audit_log;

CREATE POLICY "admin_audit_log_select_admin" 
ON public.admin_audit_log 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "admin_audit_log_insert_admin" 
ON public.admin_audit_log 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Security Events : optimisation complète
DROP POLICY IF EXISTS "security_events_select_admin" ON public.security_events;
DROP POLICY IF EXISTS "security_events_insert_admin" ON public.security_events;
DROP POLICY IF EXISTS "security_events_admin_only" ON public.security_events;

CREATE POLICY "security_events_select_admin" 
ON public.security_events 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "security_events_insert_admin" 
ON public.security_events 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
