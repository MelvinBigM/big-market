
-- Migration finale pour résoudre tous les problèmes du Performance Advisor

-- 1. Supprimer tous les index inutilisés restants
DROP INDEX IF EXISTS public.idx_products_category_essential;
DROP INDEX IF EXISTS public.idx_access_requests_status_pending;
DROP INDEX IF EXISTS public.idx_banners_active_only;

-- 2. Créer UNIQUEMENT les index essentiels pour les clés étrangères
CREATE INDEX IF NOT EXISTS idx_access_requests_user_id_final ON public.access_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_id_final ON public.admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id_final ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id_final ON public.products(category_id);

-- 3. Analyser les tables modifiées
ANALYZE public.access_requests;
ANALYZE public.admin_audit_log;
ANALYZE public.product_images;
ANALYZE public.products;
