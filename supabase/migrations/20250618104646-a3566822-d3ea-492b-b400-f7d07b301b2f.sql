
-- Suppression définitive de tous les index inutilisés détectés

-- Supprimer tous les index qui ne sont pas utilisés selon le Performance Advisor
DROP INDEX IF EXISTS public.idx_product_images_position;
DROP INDEX IF EXISTS public.idx_profiles_auth_uid_role;
DROP INDEX IF EXISTS public.idx_access_requests_user_id_final;
DROP INDEX IF EXISTS public.idx_admin_audit_log_admin_id_final;
DROP INDEX IF EXISTS public.idx_product_images_product_id_final;
DROP INDEX IF EXISTS public.idx_products_category_id_final;

-- Analyser les tables après suppression
ANALYZE public.product_images;
ANALYZE public.profiles;
ANALYZE public.access_requests;
ANALYZE public.admin_audit_log;
ANALYZE public.products;
