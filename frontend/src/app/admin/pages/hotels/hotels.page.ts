import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotelService, HotelDTO } from '../../../services/hotel.service';

export type ServiceKey = 'Bar' | 'Spa' | 'Restaurant' | 'Gym' | 'Navette';
export type ServicesMap = Record<ServiceKey, boolean>;

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
    } as ServicesMap
  };

  cities = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir'];
  hotels: HotelDTO[] = [];

  searchQuery: string = '';
  showModal = false;
  selectedHotel: HotelDTO | null = null;

  currentPage = 1;
  hotelsPerPage = 3;

  constructor(public hotelService: HotelService) {
    this.loadHotels();
  }

  get paginatedHotels(): HotelDTO[] {
    const start = (this.currentPage - 1) * this.hotelsPerPage;
    return this.filteredHotels().slice(start, start + this.hotelsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredHotels().length / this.hotelsPerPage);
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  goToPreviousPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  get serviceKeys(): ServiceKey[] {
    return Object.keys(this.hotelForm.servicesMap) as ServiceKey[];
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
          this.loadHotels();
          this.resetForm();
          this.scrollToTop();
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
      } as ServicesMap
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

  loadHotels() {
    this.hotelService.getAllHotels().subscribe({
      next: (data) => {
        this.hotels = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des hôtels :', err);
      }
    });
  }

  scrollToTop() {
    setTimeout(() => {
      const container = document.querySelector('.container, main, body');
      if (container && 'scrollTo' in container) {
        (container as HTMLElement).scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  }
}