
-- Création des index pour les clés étrangères non indexées

-- Index pour la clé étrangère products.category_id
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);

-- Index pour la clé étrangère product_images.product_id  
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);

-- Index pour la clé étrangère admin_audit_log.admin_id
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_id ON public.admin_audit_log(admin_id);

-- Index pour la clé étrangère access_requests.user_id
CREATE INDEX IF NOT EXISTS idx_access_requests_user_id ON public.access_requests(user_id);

-- Analyser les tables après création des index
ANALYZE public.products;
ANALYZE public.product_images;
ANALYZE public.admin_audit_log;
ANALYZE public.access_requests;
