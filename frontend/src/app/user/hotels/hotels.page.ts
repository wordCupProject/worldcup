import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { HotelService, HotelDTO } from '../../services/hotel.service';
import { AuthService } from '../../services/auth.service';
import { ReservationModalComponent } from '../components/reservation-modal/reservation-modal.component';
import { PaymentModalComponent } from '../components/reservation-modal/PaymentModal.component';
import { HotelReservationDTO } from '../../services/hotel.reservation.service';
import { PaymentDTO } from '../../services/payment.service';

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
  imports: [CommonModule, FormsModule, ReservationModalComponent, PaymentModalComponent],
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

  // ✅ NOUVELLES PROPRIÉTÉS POUR LE PAIEMENT
  showPaymentModal = false;
  reservationForPayment: any = null; // Contiendra les détails de la réservation créée

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

    // Ouvrir le modal de réservation
    this.selectedHotel = hotel;
    this.showReservationModal = true;
    
    console.log('Modal opened with hotel:', this.selectedHotel);
    console.log('Show modal flag:', this.showReservationModal);
  }

  // Méthode appelée quand le modal de réservation se ferme
  onReservationModalClosed() {
    console.log('Reservation modal closed');
    this.showReservationModal = false;
    this.selectedHotel = null;
  }

  // ✅ MÉTHODE MISE À JOUR : Appelée quand une réservation est créée avec succès
  onReservationCreated(reservationDetails: any) {
    console.log('🎉 Réservation créée avec succès:', reservationDetails);
    
    // Fermer le modal de réservation
    this.showReservationModal = false;
    this.selectedHotel = null;
    
    // ✅ OUVRIR LE MODAL DE PAIEMENT
    this.reservationForPayment = reservationDetails;
    this.showPaymentModal = true;
    
    console.log('💳 Opening payment modal with reservation:', this.reservationForPayment);
  }

  // ✅ NOUVELLE MÉTHODE : Appelée quand le modal de paiement se ferme
  onPaymentModalClosed() {
    console.log('Payment modal closed');
    this.showPaymentModal = false;
    this.reservationForPayment = null;
  }

  // ✅ NOUVELLE MÉTHODE : Appelée quand un paiement est complété avec succès
  onPaymentCompleted(payment: PaymentDTO) {
    console.log('💰 Paiement complété avec succès:', payment);
    
    // Fermer le modal de paiement
    this.showPaymentModal = false;
    this.reservationForPayment = null;
    
    // Afficher un message de succès personnalisé
    this.showSuccessMessage();
    
    // Optionnel: rediriger vers la page des réservations après un délai
    setTimeout(() => {
      this.router.navigate(['/user/reservations']);
    }, 3000);
  }

  // ✅ NOUVELLE MÉTHODE : Afficher un message de succès
  private showSuccessMessage() {
    // Créer et afficher un message de succès personnalisé
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 transition-all duration-300';
    successDiv.innerHTML = `
      <div class="flex items-center">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <div>
          <div class="font-bold">Réservation confirmée !</div>
          <div class="text-sm">Votre paiement a été traité avec succès</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(successDiv);
    
    // Supprimer le message après 5 secondes
    setTimeout(() => {
      if (successDiv.parentElement) {
        successDiv.remove();
      }
    }, 5000);
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