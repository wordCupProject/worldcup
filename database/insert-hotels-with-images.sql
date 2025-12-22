-- Script pour insérer des hôtels avec images via URLs
-- Exécuter ce script dans MySQL après avoir démarré le backend une première fois pour créer les tables

USE worldcupdb;

-- Insérer des hôtels
INSERT INTO hotel (name, city, stars, address, description, photo_path) VALUES
('Sofitel Casablanca Tour Blanche', 'Casablanca', 5, 'Rue Sidi Belyout', 'Hôtel de luxe au cœur de Casablanca avec vue panoramique', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'),
('Riad Fès', 'Fès', 4, 'Médina de Fès', 'Riad traditionnel dans la vieille ville de Fès', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'),
('La Mamounia', 'Marrakech', 5, 'Avenue Bab Jdid', 'Palace emblématique de Marrakech entouré de jardins', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'),
('Fairmont Royal Palm', 'Marrakech', 5, 'Route d\'Amizmiz Km 8', 'Resort de golf et spa de luxe', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'),
('Hôtel Farah Rabat', 'Rabat', 4, 'Place Sidi Makhlouf', 'Hôtel moderne près des sites gouvernementaux', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'),
('Banyan Tree Tamouda Bay', 'Tétouan', 5, 'Tamouda Bay', 'Resort en bord de mer méditerranéenne', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'),
('Sofitel Agadir Royal Bay', 'Agadir', 5, 'Baie des Palmiers', 'Resort en bord de plage avec thalasso', 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800'),
('Atlas Essaouira', 'Essaouira', 4, 'Boulevard Mohammed V', 'Hôtel face à l\'océan Atlantique', 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=800'),
('Palais Amani', 'Fès', 5, 'Derb el Miter', 'Palais restauré en hôtel de charme', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'),
('Hivernage Hotel & Spa', 'Marrakech', 4, 'Angle Av Echouhada et Rue Des Temples', 'Hôtel moderne au cœur de l\'Hivernage', 'https://images.unsplash.com/photo-1445991842772-097fea258e7b?w=800');

-- Insérer les services pour chaque hôtel
-- Sofitel Casablanca (id=1)
INSERT INTO hotel_services (hotel_id, service) VALUES
(1, 'WiFi Gratuit'),
(1, 'Piscine'),
(1, 'Restaurant'),
(1, 'Spa'),
(1, 'Parking');

-- Riad Fès (id=2)
INSERT INTO hotel_services (hotel_id, service) VALUES
(2, 'WiFi Gratuit'),
(2, 'Petit déjeuner inclus'),
(2, 'Terrasse'),
(2, 'Climatisation');

-- La Mamounia (id=3)
INSERT INTO hotel_services (hotel_id, service) VALUES
(3, 'WiFi Gratuit'),
(3, 'Piscine'),
(3, 'Restaurant Gastronomique'),
(3, 'Spa'),
(3, 'Jardins'),
(3, 'Casino');

-- Fairmont Royal Palm (id=4)
INSERT INTO hotel_services (hotel_id, service) VALUES
(4, 'WiFi Gratuit'),
(4, 'Golf 18 trous'),
(4, 'Piscine'),
(4, 'Restaurant'),
(4, 'Spa'),
(4, 'Centre équestre');

-- Farah Rabat (id=5)
INSERT INTO hotel_services (hotel_id, service) VALUES
(5, 'WiFi Gratuit'),
(5, 'Piscine'),
(5, 'Restaurant'),
(5, 'Salle de sport'),
(5, 'Parking');

-- Banyan Tree (id=6)
INSERT INTO hotel_services (hotel_id, service) VALUES
(6, 'WiFi Gratuit'),
(6, 'Plage privée'),
(6, 'Piscine'),
(6, 'Spa'),
(6, 'Restaurant'),
(6, 'Sports nautiques');

-- Sofitel Agadir (id=7)
INSERT INTO hotel_services (hotel_id, service) VALUES
(7, 'WiFi Gratuit'),
(7, 'Plage privée'),
(7, 'Piscine'),
(7, 'Thalasso'),
(7, 'Restaurant'),
(7, 'Animation');

-- Atlas Essaouira (id=8)
INSERT INTO hotel_services (hotel_id, service) VALUES
(8, 'WiFi Gratuit'),
(8, 'Vue océan'),
(8, 'Restaurant'),
(8, 'Terrasse'),
(8, 'Parking');

-- Palais Amani (id=9)
INSERT INTO hotel_services (hotel_id, service) VALUES
(9, 'WiFi Gratuit'),
(9, 'Piscine'),
(9, 'Restaurant'),
(9, 'Spa'),
(9, 'Hammam'),
(9, 'Bibliothèque');

-- Hivernage (id=10)
INSERT INTO hotel_services (hotel_id, service) VALUES
(10, 'WiFi Gratuit'),
(10, 'Piscine'),
(10, 'Restaurant'),
(10, 'Spa'),
(10, 'Salle de sport'),
(10, 'Bar');
