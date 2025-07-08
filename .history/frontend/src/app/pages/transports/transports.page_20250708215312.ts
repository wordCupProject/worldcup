import { Component } from '@angular/core';  

interface Transport {  
  id: number;  
  type: 'PLANE' | 'BUS' | 'TRAIN' | 'CAR'; // ou autres en fonction de votre enum  
  departureCity: string;  
  arrivalCity: string;    departureTime: string; // ISO format date
  arrivalTime: string;   // ISO format date
  price: number;
}

@Component({
  selector: 'app-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.css']
})
export class TransportComponent {
  // Filtres
  departureCityFilter: string = '';
  arrivalCityFilter: string = '';
  typeFilter: string = '';
  dateFilter: string = ''; // Format 'YYYY-MM-DD'
  minPriceFilter: number | null = null;
  maxPriceFilter: number | null = null;

  // Liste des transports - exemple de données
  transports: Transport[] = [
    {
      id: 1,
      type: 'PLANE',
      departureCity: 'Marrakech',
      arrivalCity: 'Casablanca',
      departureTime: '2025-07-10T08:00',
      arrivalTime: '2025-07-10T09:30',
      price: 800
    },
    {
      id: 2,
      type: 'BUS',
      departureCity: 'Rabat',
      arrivalCity: 'Fès',
      departureTime: '2025-07-10T07:00',
      arrivalTime: '2025-07-10T10:00',
      price: 150
    },
    {
      id: 3,
      type: 'TRAIN',
      departureCity: 'Casablanca',
      arrivalCity: 'Marrakech',
      departureTime: '2025-07-11T14:00',
      arrivalTime: '2025-07-11T17:00',
      price: 200
    },
    // Ajoutez d'autres objets selon besoin
  ];

  // Filtrer la liste en fonction des filtres
  get filteredTransports() {
    return this.transports.filter(t => {
      // Filtres par villes
      const departureMatch = this.departureCityFilter ? t.departureCity.toLowerCase().includes(this.departureCityFilter.toLowerCase()) : true;
      const arrivalMatch = this.arrivalCityFilter ? t.arrivalCity.toLowerCase().includes(this.arrivalCityFilter.toLowerCase()) : true;
      
      // Filtres par type
      const typeMatch = this.typeFilter ? t.type === this.typeFilter : true;
      
      // Filtres par date (départ)
      const dateMatch = this.dateFilter ? t.departureTime.startsWith(this.dateFilter) : true;
      
      // Filtres par prix
      const priceMatch = (() => {
        if (this.minPriceFilter !== null && t.price < this.minPriceFilter) return false;
        if (this.maxPriceFilter !== null && t.price > this.maxPriceFilter) return false;
        return true;
      })();

      return departureMatch && arrivalMatch && typeMatch && dateMatch && priceMatch;
    });
  }

  // Action lors de la recherche
  onSearch() {
    // La liste filtrée est automatiquement mise à jour via la getter
  }
}