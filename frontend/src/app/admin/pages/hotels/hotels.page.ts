import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotelService, HotelDTO } from '../../../services/hotel.service';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    photo: null as File | null,
    servicesMap: {
      Bar: false,
      Spa: false,
      Restaurant: false,
      Gym: false,
      Navette: false
    }
  };

  cities = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir'];

  hotels: HotelDTO[] = [];

  searchQuery: string = '';
  showModal = false;
  selectedHotel: HotelDTO | null = null;

  constructor(private hotelService: HotelService) {
    // Charger la liste initiale si besoin (ajouter méthode getHotels() dans service)
  }

  addHotel() {
    const selectedServices = Object.entries(this.hotelForm.servicesMap)
      .filter(([_, isChecked]) => isChecked)
      .map(([serviceName]) => serviceName);

    if (this.hotelForm.photo) {
      const formData = new FormData();
      formData.append('name', this.hotelForm.name);
      formData.append('city', this.hotelForm.city);
      formData.append('stars', this.hotelForm.stars.toString());
      formData.append('address', this.hotelForm.address);
      formData.append('description', this.hotelForm.description || '');
      formData.append('photo', this.hotelForm.photo);
      formData.append('services', JSON.stringify(selectedServices));

      this.hotelService.addHotel(formData).subscribe({
        next: () => {
          alert('Hôtel ajouté avec succès !');
          this.hotels.push({
            name: this.hotelForm.name,
            city: this.hotelForm.city,
            stars: this.hotelForm.stars,
            address: this.hotelForm.address,
            description: this.hotelForm.description,
            services: selectedServices
          });
          this.resetForm();
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout de l\'hôtel :', err);
          alert('Erreur lors de l\'ajout de l\'hôtel.');
        }
      });
    } else {
      const newHotel: HotelDTO = {
        name: this.hotelForm.name,
        city: this.hotelForm.city,
        stars: this.hotelForm.stars,
        address: this.hotelForm.address,
        description: this.hotelForm.description,
        services: selectedServices
      };

      this.hotelService.addHotel(newHotel).subscribe({
        next: () => {
          alert('Hôtel ajouté avec succès !');
          this.hotels.push(newHotel);
          this.resetForm();
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout de l\'hôtel :', err);
          alert('Erreur lors de l\'ajout de l\'hôtel.');
        }
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.hotelForm.photo = file;
      console.log('Photo sélectionnée :', file.name);
    }
  }

  resetForm() {
    this.hotelForm = {
      name: '',
      city: '',
      stars: 5,
      address: '',
      description: '',
      photo: null,
      servicesMap: {
        Bar: false,
        Spa: false,
        Restaurant: false,
        Gym: false,
        Navette: false
      }
    };
  }

  viewDetails(hotel: HotelDTO) {
    this.selectedHotel = hotel;
    this.showModal = true;
  }

  closeModal() {
    this.selectedHotel = null;
    this.showModal = false;
  }

  filteredHotels(): HotelDTO[] {
    if (!this.searchQuery.trim()) return this.hotels;
    return this.hotels.filter(h =>
      h.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
