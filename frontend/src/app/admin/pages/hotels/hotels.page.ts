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
  showEditModal = false;
  showDeleteModal = false;
  selectedHotel: HotelDTO | null = null;
  editingHotel: HotelDTO | null = null;
  hotelToDelete: HotelDTO | null = null;
  
  // Messages de notification
  successMessage: string = '';
  errorMessage: string = '';
  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;

  currentPage = 1;
  hotelsPerPage = 3;
  isEditing = false;

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
          this.displaySuccessMessage('Hôtel ajouté avec succès !');
          this.loadHotels();
          this.resetForm();
          this.scrollToTop();
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout de l\'hôtel :', err);
          this.displayErrorMessage('Erreur lors de l\'ajout de l\'hôtel : ' + err.message);
        }
      });
    }
  }

  // Nouvelles méthodes pour l'édition
  editHotel(hotel: HotelDTO) {
    this.editingHotel = { ...hotel };
    this.isEditing = true;
    
    // Remplir le formulaire avec les données de l'hôtel
    this.hotelForm = {
      name: hotel.name,
      city: hotel.city,
      stars: hotel.stars,
      address: hotel.address,
      description: hotel.description || '',
      photo: null, // On ne peut pas pré-remplir un input file
      servicesMap: {
        Bar: hotel.services.includes('Bar'),
        Spa: hotel.services.includes('Spa'),
        Restaurant: hotel.services.includes('Restaurant'),
        Gym: hotel.services.includes('Gym'),
        Navette: hotel.services.includes('Navette')
      }
    };
    
    this.showEditModal = true;
  }

  updateHotel() {
    if (!this.editingHotel || !this.editingHotel.id) return;

    const selectedServices = Object.entries(this.hotelForm.servicesMap)
      .filter(([_, isChecked]) => isChecked)
      .map(([serviceName]) => serviceName);

    const hotelData: HotelDTO = {
      id: this.editingHotel.id,
      name: this.hotelForm.name,
      city: this.hotelForm.city,
      stars: this.hotelForm.stars,
      address: this.hotelForm.address,
      description: this.hotelForm.description,
      services: selectedServices,
      photoPath: this.editingHotel.photoPath // Garder l'ancienne photo pour l'instant
    };

    this.hotelService.updateHotel(this.editingHotel.id, hotelData).subscribe({
      next: () => {
        this.displaySuccessMessage('Hôtel modifié avec succès !');
        this.loadHotels();
        this.closeEditModal();
        this.scrollToTop();
      },
      error: (err) => {
        console.error('Erreur lors de la modification de l\'hôtel :', err);
        this.displayErrorMessage('Erreur lors de la modification de l\'hôtel : ' + err.message);
      }
    });
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingHotel = null;
    this.isEditing = false;
    this.resetForm();
  }

  // Nouvelles méthodes pour la suppression
  confirmDelete(hotel: HotelDTO) {
    this.hotelToDelete = hotel;
    this.showDeleteModal = true;
  }

  deleteHotel() {
    if (!this.hotelToDelete || !this.hotelToDelete.id) return;

    // Désactiver les boutons pendant la suppression
    const deleteButton = document.querySelector('.delete-confirm-btn') as HTMLButtonElement;
    if (deleteButton) {
      deleteButton.disabled = true;
      deleteButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Suppression...';
    }

    this.hotelService.deleteHotel(this.hotelToDelete.id).subscribe({
      next: () => {
        this.displaySuccessMessage('Hôtel supprimé avec succès !');
        this.loadHotels();
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de l\'hôtel :', err);
        this.displayErrorMessage('Erreur lors de la suppression de l\'hôtel : ' + err.message);
        
        // Réactiver le bouton en cas d'erreur
        if (deleteButton) {
          deleteButton.disabled = false;
          deleteButton.innerHTML = '<i class="fas fa-trash mr-2"></i>Supprimer';
        }
      }
    });
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.hotelToDelete = null;
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

  // Méthodes pour les notifications (renommées pour éviter les conflits)
  private displaySuccessMessage(message: string) {
    this.successMessage = message;
    this.showSuccessMessage = true;
    this.showErrorMessage = false;
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 5000);
  }

  private displayErrorMessage(message: string) {
    this.errorMessage = message;
    this.showErrorMessage = true;
    this.showSuccessMessage = false;
    setTimeout(() => {
      this.showErrorMessage = false;
    }, 7000);
  }

  dismissSuccessMessage() {
    this.showSuccessMessage = false;
  }

  dismissErrorMessage() {
    this.showErrorMessage = false;
  }
}