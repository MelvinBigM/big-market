-- Créer un bucket pour les images de produits
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Créer les politiques pour le bucket product-images
CREATE POLICY "Les images de produits sont publiquement accessibles" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Les admins peuvent télécharger des images de produits" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'product-images' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Les admins peuvent mettre à jour des images de produits" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'product-images' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Les admins peuvent supprimer des images de produits" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'product-images' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);