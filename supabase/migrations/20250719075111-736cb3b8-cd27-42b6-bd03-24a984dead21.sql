-- Supprimer toutes les images avec liens des produits
UPDATE products SET image_url = NULL WHERE image_url IS NOT NULL AND image_url != '';

-- Supprimer toutes les images avec liens de la table product_images
DELETE FROM product_images WHERE image_url LIKE 'http%';