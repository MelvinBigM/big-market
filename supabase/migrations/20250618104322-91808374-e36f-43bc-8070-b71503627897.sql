
-- Supprimer les index inutilisés détectés par le Performance Advisor

-- Supprimer les index redondants ou inutilisés
DROP INDEX IF EXISTS public.idx_profiles_id; -- Redondant avec la clé primaire
DROP INDEX IF EXISTS public.idx_categories_position;
DROP INDEX IF EXISTS public.idx_product_images_product_id; -- Peut être redondant si peu utilisé
DROP INDEX IF EXISTS public.idx_access_requests_status;
DROP INDEX IF EXISTS public.idx_admin_audit_log_admin_id;
DROP INDEX IF EXISTS public.idx_products_position;
DROP INDEX IF EXISTS public.idx_access_requests_user_id;
DROP INDEX IF EXISTS public.idx_products_category_id;
DROP INDEX IF EXISTS public.idx_banners_active_position;
DROP INDEX IF EXISTS public.idx_products_in_stock;
DROP INDEX IF EXISTS public.idx_profiles_role_created_at;
DROP INDEX IF EXISTS public.idx_admin_audit_log_created_at;
DROP INDEX IF EXISTS public.idx_security_events_created_at;

-- Garder seulement les index vraiment nécessaires pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_products_category_essential ON public.products(category_id) WHERE in_stock = true;
CREATE INDEX IF NOT EXISTS idx_access_requests_status_pending ON public.access_requests(status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_banners_active_only ON public.banners(position) WHERE active = true;

-- Analyser à nouveau les tables après nettoyage
ANALYZE public.products;
ANALYZE public.access_requests;
ANALYZE public.banners;
