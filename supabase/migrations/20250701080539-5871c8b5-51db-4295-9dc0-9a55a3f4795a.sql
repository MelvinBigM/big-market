
-- Ajouter la colonne email à la table profiles
ALTER TABLE public.profiles ADD COLUMN email text;

-- Mettre à jour la fonction handle_new_user pour inclure l'email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
begin
  insert into public.profiles (
    id,
    role,
    company_name,
    manager_first_name,
    manager_last_name,
    phone_number,
    is_company,
    address,
    city,
    postal_code,
    email
  )
  values (
    new.id,
    'nouveau',
    new.raw_user_meta_data->>'company_name',
    new.raw_user_meta_data->>'manager_first_name',
    new.raw_user_meta_data->>'manager_last_name',
    new.raw_user_meta_data->>'phone_number',
    (new.raw_user_meta_data->>'is_company')::boolean,
    new.raw_user_meta_data->>'address',
    new.raw_user_meta_data->>'city',
    new.raw_user_meta_data->>'postal_code',
    new.email
  );
  return new;
end;
$$;
