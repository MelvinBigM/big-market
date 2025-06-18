
-- Corriger l'avertissement "Materialized View in API" pour admin_users

-- 1. Supprimer la vue de l'API en révoquant tous les privilèges
REVOKE ALL ON public.admin_users FROM anon;
REVOKE ALL ON public.admin_users FROM authenticated;
REVOKE ALL ON public.admin_users FROM service_role;

-- 2. Ajouter un commentaire pour exclure la vue de l'API PostgREST
COMMENT ON MATERIALIZED VIEW public.admin_users IS '@omit';

-- 3. S'assurer que seules les fonctions SECURITY DEFINER peuvent accéder à cette vue
-- (Les fonctions existantes comme is_admin_user() et check_admin_direct() continueront de fonctionner)

-- 4. Rafraîchir la vue pour s'assurer qu'elle est à jour
REFRESH MATERIALIZED VIEW CONCURRENTLY public.admin_users;
