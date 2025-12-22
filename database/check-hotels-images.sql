-- Vérifier si les images sont bien enregistrées
USE worldcupdb;

-- Afficher tous les hôtels avec leur photoPath
SELECT id, name, city, photo_path 
FROM hotel 
ORDER BY id;

-- Compter les hôtels avec et sans images
SELECT 
    COUNT(*) as total_hotels,
    SUM(CASE WHEN photo_path IS NOT NULL THEN 1 ELSE 0 END) as with_images,
    SUM(CASE WHEN photo_path IS NULL THEN 1 ELSE 0 END) as without_images
FROM hotel;
