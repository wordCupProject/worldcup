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
  imports: [CommonModule, FormsModule,ReservationModalComponent],
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
    this.loadUserEmail();
    this.loadHotels();
  }

  loadUserEmail(): void {
    const user = this.authService.getAuthenticatedUser();
    if (user && user.email) {
      this.userEmail = user.email;
    } else {
      this.userEmail = 'Invité';
    }
  }

  loadHotels(): void {
    this.hotelService.getAllHotels().subscribe({
      next: (data: HotelDTO[]) => {
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
  }

  // Nouvelle méthode pour ouvrir le modal de réservation
  openReservationModal(hotel: Hotel) {
    const user = this.authService.getAuthenticatedUser();
    if (!user) {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      this.router.navigate(['/login']);
      return;
    }

    this.selectedHotel = hotel;
    this.showReservationModal = true;
  }

  // Méthode appelée quand le modal se ferme
  onModalClosed() {
    this.showReservationModal = false;
    this.selectedHotel = null;
  }

  // Méthode appelée quand une réservation est créée avec succès
  onReservationCreated(reservation: HotelReservationDTO) {
    console.log('Réservation créée:', reservation);
    // Optionnel: afficher un message de succès ou rediriger
    // this.router.navigate(['/user/reservations']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Méthode obsolète, remplacée par openReservationModal
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}