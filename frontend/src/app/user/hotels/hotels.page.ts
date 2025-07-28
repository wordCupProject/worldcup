import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { HotelService, HotelDTO } from '../../services/hotel.service';
import { AuthService } from '../../services/auth.service';
import { ReservationModalComponent } from '../components/reservation-modal/reservation-modal.component';
import { HotelReservationDTO } from '../../services/hotel.reservation.service';

interface Hotel {
  id?: number;
  title: string;
  city: string;
  distanceToStadium: string;
  rating: number;
  ratingHalf?: boolean;
  features: string[];
  price: number;
  status: 'confirmed' | 'pending';
  image: string;
  alt: string;
}

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule, FormsModule, ReservationModalComponent],
  templateUrl: './hotels.page.html',
  styleUrls: ['./hotels.page.css']
})
export class HotelsUser implements OnInit {
  cityFilter = '';
  guestsFilter = '1';
  priceFilter = '';
  ratingFilter = '';

  hotels: Hotel[] = [];
  userEmail: string = '';
  userDropdownOpen = false;

  // Propriétés pour le modal de réservation
  showReservationModal = false;
  selectedHotel: Hotel | null = null;

  constructor(
    private hotelService: HotelService, 
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('HotelsUser component initialized');
    this.loadUserEmail();
    this.loadHotels();
  }

  loadUserEmail(): void {
    const user = this.authService.getAuthenticatedUser();
    console.log('Loading user email, user:', user);
    
    if (user && user.email) {
      this.userEmail = user.email;
    } else {
      this.userEmail = 'Invité';
    }
    
    console.log('User email set to:', this.userEmail);
  }

  loadHotels(): void {
    console.log('Loading hotels...');
    
    this.hotelService.getAllHotels().subscribe({
      next: (data: HotelDTO[]) => {
        console.log('Hotels loaded:', data);
        
        this.hotels = data.map((dto) => ({
          id: dto.id,
          title: dto.name,
          city: dto.city,
          distanceToStadium: 'Proche du stade',
          rating: dto.stars,
          features: dto.services,
          price: 1000,
          status: 'confirmed',
          image: dto.photoPath ? this.hotelService.getImageUrl(dto.photoPath) : 'https://via.placeholder.com/600x400',
          alt: dto.name,
        }));
        
        console.log('Hotels mapped:', this.hotels);
      },
      error: (err) => {
        console.error('Erreur récupération hôtels', err);
      }
    });
  }

  get filteredHotels() {
    return this.hotels.filter(hotel => {
      const cityMatch = this.cityFilter ? hotel.city.toLowerCase() === this.cityFilter.toLowerCase() : true;
      const ratingMatch = this.ratingFilter ? hotel.rating === +this.ratingFilter : true;
      const priceMatch = (() => {
        if (!this.priceFilter) return true;
        if (this.priceFilter === '2000+') return hotel.price > 2000;
        const [min, max] = this.priceFilter.split('-').map(Number);
        return hotel.price >= min && hotel.price <= max;
      })();
      return cityMatch && ratingMatch && priceMatch;
    });
  }

  onSearch() {
    // Rien ici, tout est géré par le getter
    console.log('Search triggered');
  }

  // Méthode pour ouvrir le modal de réservation
  openReservationModal(hotel: Hotel) {
    console.log('Opening reservation modal for hotel:', hotel);
    
    // Vérifier l'authentification
    const isAuthenticated = this.authService.isAuthenticated();
    console.log('Is user authenticated:', isAuthenticated);
    
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    // Vérifier que l'hôtel a un ID
    if (!hotel.id) {
      console.error('Hotel ID is missing:', hotel);
      alert('Erreur: Impossible d\'identifier l\'hôtel. Veuillez rafraîchir la page.');
      return;
    }

    // Ouvrir le modal
    this.selectedHotel = hotel;
    this.showReservationModal = true;
    
    console.log('Modal opened with hotel:', this.selectedHotel);
    console.log('Show modal flag:', this.showReservationModal);
  }

  // Méthode appelée quand le modal se ferme
  onModalClosed() {
    console.log('Modal closed');
    this.showReservationModal = false;
    this.selectedHotel = null;
  }

  // Méthode appelée quand une réservation est créée avec succès
  onReservationCreated(reservation: HotelReservationDTO) {
    console.log('Réservation créée avec succès:', reservation);
    
    // Afficher une notification de succès (optionnel)
    alert('Réservation créée avec succès !');
    
    // Optionnel: rediriger vers la page des réservations
    // this.router.navigate(['/user/reservations']);
  }

  logout(): void {
    console.log('User logging out');
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Méthode pour navigation vers login (si nécessaire)
  navigateToLogin() {
    console.log('Navigating to login');
    this.router.navigate(['/login']);
  }
}