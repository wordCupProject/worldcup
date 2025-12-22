// Script JavaScript pour insérer des hôtels via l'API REST
// Exécutez ce script dans la console du navigateur après vous être connecté en tant qu'admin

const hotels = [
  {
    name: "Sofitel Casablanca Tour Blanche",
    city: "Casablanca",
    stars: 5,
    address: "Rue Sidi Belyout",
    description: "Hôtel de luxe au cœur de Casablanca avec vue panoramique",
    photoPath: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    services: ["WiFi Gratuit", "Piscine", "Restaurant", "Spa", "Parking"]
  },
  {
    name: "Riad Fès",
    city: "Fès",
    stars: 4,
    address: "Médina de Fès",
    description: "Riad traditionnel dans la vieille ville de Fès",
    photoPath: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    services: ["WiFi Gratuit", "Petit déjeuner inclus", "Terrasse", "Climatisation"]
  },
  {
    name: "La Mamounia",
    city: "Marrakech",
    stars: 5,
    address: "Avenue Bab Jdid",
    description: "Palace emblématique de Marrakech entouré de jardins",
    photoPath: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
    services: ["WiFi Gratuit", "Piscine", "Restaurant Gastronomique", "Spa", "Jardins", "Casino"]
  },
  {
    name: "Fairmont Royal Palm",
    city: "Marrakech",
    stars: 5,
    address: "Route d'Amizmiz Km 8",
    description: "Resort de golf et spa de luxe",
    photoPath: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
    services: ["WiFi Gratuit", "Golf 18 trous", "Piscine", "Restaurant", "Spa", "Centre équestre"]
  },
  {
    name: "Hôtel Farah Rabat",
    city: "Rabat",
    stars: 4,
    address: "Place Sidi Makhlouf",
    description: "Hôtel moderne près des sites gouvernementaux",
    photoPath: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
    services: ["WiFi Gratuit", "Piscine", "Restaurant", "Salle de sport", "Parking"]
  },
  {
    name: "Banyan Tree Tamouda Bay",
    city: "Tétouan",
    stars: 5,
    address: "Tamouda Bay",
    description: "Resort en bord de mer méditerranéenne",
    photoPath: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
    services: ["WiFi Gratuit", "Plage privée", "Piscine", "Spa", "Restaurant", "Sports nautiques"]
  },
  {
    name: "Sofitel Agadir Royal Bay",
    city: "Agadir",
    stars: 5,
    address: "Baie des Palmiers",
    description: "Resort en bord de plage avec thalasso",
    photoPath: "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800",
    services: ["WiFi Gratuit", "Plage privée", "Piscine", "Thalasso", "Restaurant", "Animation"]
  },
  {
    name: "Atlas Essaouira",
    city: "Essaouira",
    stars: 4,
    address: "Boulevard Mohammed V",
    description: "Hôtel face à l'océan Atlantique",
    photoPath: "https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=800",
    services: ["WiFi Gratuit", "Vue océan", "Restaurant", "Terrasse", "Parking"]
  },
  {
    name: "Palais Amani",
    city: "Fès",
    stars: 5,
    address: "Derb el Miter",
    description: "Palais restauré en hôtel de charme",
    photoPath: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
    services: ["WiFi Gratuit", "Piscine", "Restaurant", "Spa", "Hammam", "Bibliothèque"]
  },
  {
    name: "Hivernage Hotel & Spa",
    city: "Marrakech",
    stars: 4,
    address: "Angle Av Echouhada et Rue Des Temples",
    description: "Hôtel moderne au cœur de l'Hivernage",
    photoPath: "https://images.unsplash.com/photo-1445991842772-097fea258e7b?w=800",
    services: ["WiFi Gratuit", "Piscine", "Restaurant", "Spa", "Salle de sport", "Bar"]
  }
];

// Fonction pour insérer un hôtel
async function insertHotel(hotel) {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch('http://localhost:8081/api/hotels', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(hotel)
  });
  
  if (response.ok) {
    const data = await response.json();
    console.log('✅ Hôtel ajouté:', hotel.name, data);
    return data;
  } else {
    console.error('❌ Erreur pour:', hotel.name, await response.text());
    throw new Error('Failed to insert hotel');
  }
}

// Insérer tous les hôtels
async function insertAllHotels() {
  console.log('🏨 Insertion de', hotels.length, 'hôtels...');
  
  for (const hotel of hotels) {
    try {
      await insertHotel(hotel);
      await new Promise(resolve => setTimeout(resolve, 500)); // Pause de 500ms entre chaque requête
    } catch (error) {
      console.error('Erreur:', error);
    }
  }
  
  console.log('✅ Insertion terminée !');
}

// Lancer l'insertion
insertAllHotels();
