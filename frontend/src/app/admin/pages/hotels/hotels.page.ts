import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';                   // ← Import ajouté
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

interface Hotel {
  name: string;
  city: string;
  address: string;
  stars: number;
  description?: string;
}

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,                                            // ← Ajouté ici
    FontAwesomeModule
  ],
  templateUrl: './hotels.page.html',
  styleUrls: ['./hotels.page.css']
})
export class HotelsPage {
  hotelForm = {
    name: '',
    city: '',
    stars: 5,
    address: '',
    description: '',
    photo: null
  };

  cities = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir'];

  hotels: any[] = [
    {
      name: 'Hôtel Kenzi Tower',
      city: 'Casablanca',
      stars: 5,
      address: 'Bd Mohamed Zerktouni, Casablanca',
      description: 'Tour la plus haute du Maroc offrant une vue panoramique sur Casablanca et l\'océan Atlantique.'
    }
  ];

  searchQuery: string = '';
  showModal = false;
  selectedHotel: any = null;

  addHotel() {
    this.hotels.push({ ...this.hotelForm });
    this.hotelForm = { name: '', city: '', stars: 5, address: '', description: '', photo: null };
  }

  viewDetails(hotel: any) {
    this.selectedHotel = hotel;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedHotel = null;
  }

  onFileSelected(event: any) {
    this.hotelForm.photo = event.target.files[0];
  }

  filteredHotels() {
    if (!this.searchQuery.trim()) return this.hotels;
    return this.hotels.filter(h => h.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }
}

