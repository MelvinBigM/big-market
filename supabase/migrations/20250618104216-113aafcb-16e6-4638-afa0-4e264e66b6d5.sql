
-- Corriger les problèmes de performance détectés par le Performance Advisor

-- 1. Ajouter les index manquants pour les clés étrangères
CREATE INDEX IF NOT EXISTS idx_access_requests_user_id ON public.access_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_id ON public.admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

-- 2. Ajouter des index pour améliorer les performances des requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_access_requests_status ON public.access_requests(status);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON public.products(in_stock);
CREATE INDEX IF NOT EXISTS idx_banners_active_position ON public.banners(active, position);
CREATE INDEX IF NOT EXISTS idx_categories_position ON public.categories(position);
CREATE INDEX IF NOT EXISTS idx_products_position ON public.products(position);

-- 3. Ajouter des index composites pour les requêtes complexes
CREATE INDEX IF NOT EXISTS idx_profiles_role_created_at ON public.profiles(role, created_at);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON public.admin_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON public.security_events(created_at DESC);

-- 4. Analyser les tables pour mettre à jour les statistiques
ANALYZE public.access_requests;
ANALYZE public.admin_audit_log;
ANALYZE public.products;
ANALYZE public.product_images;
ANALYZE public.profiles;
ANALYZE public.banners;
ANALYZE public.categories;
ANALYZE public.security_events;
