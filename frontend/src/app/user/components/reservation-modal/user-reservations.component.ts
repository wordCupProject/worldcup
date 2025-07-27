import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HotelReservationService, HotelReservationDTO } from '../../../services/hotel.reservation.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-reservations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Header -->
    <div class="min-h-screen bg-gray-50">
      <header class="bg-[linear-gradient(to_bottom_right,#e53e3e,#38a169)] shadow-md p-2 text-white">
        <div class="container mx-auto px-4 py-3">
          <div class="flex justify-between items-center">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 class="text-2xl font-bold">MAROC <span class="text-white">2030</span></h1>
            </div>
            
            <nav class="hidden md:block">
              <ul class="flex space-x-8">
                <li><a href="/user" class="hover:text-gray-200 font-medium">Tableau de bord</a></li>
                <li><a href="/user/hotels" class="hover:text-gray-200 font-medium">Hôtels</a></li>
                <li><a href="/user/reservations" class="hover:text-gray-200 font-medium text-gray-200">Mes Réservations</a></li>
                <li><a href="#" class="hover:text-gray-200 font-medium">Transport</a></li>
              </ul>
            </nav>
            
            <div class="flex items-center">
              <div class="relative">
                <button (click)="userDropdownOpen = !userDropdownOpen" 
                        class="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                  {{ userEmail }}
                  <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
                <div *ngIf="userDropdownOpen" class="absolute bg-white rounded-lg shadow-lg mt-1 right-0 w-48 z-10">
                  <a href="#" class="block px-4 py-2 hover:bg-gray-100 text-gray-700">Mon profil</a>
                  <a href="#" class="block px-4 py-2 hover:bg-gray-100 text-gray-700">Paramètres</a>
                  <a href="#" (click)="logout()" class="block px-4 py-2 hover:bg-gray-100 text-gray-700">Déconnexion</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 py-8">
        <h2 class="text-3xl font-semibold text-gray-800 text-center mb-10 border-b-4 border-red-600 inline-block pb-2">
          Mes Réservations d'Hôtels
        </h2>

        <!-- Message de chargement -->
        <div *ngIf="isLoading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <p class="mt-2 text-gray-600">Chargement de vos réservations...</p>
        </div>

        <!-- Message si aucune réservation -->
        <div *ngIf="!isLoading && reservations.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune réservation</h3>
          <p class="mt-1 text-sm text-gray-500">Vous n'avez pas encore effectué de réservation d'hôtel.</p>
          <div class="mt-6">
            <button (click)="navigateToHotels()" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
              Découvrir nos hôtels
            </button>
          </div>
        </div>

        <!-- Liste des réservations -->
        <div *ngIf="!isLoading && reservations.length > 0" class="space-y-6">
          <div *ngFor="let reservation of reservations" class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="p-6">
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="text-xl font-semibold text-gray-900">{{ reservation.hotelName }}</h3>
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                          [ngClass]="{
                            'bg-green-100 text-green-800': reservation.paymentStatus === 'CONFIRMED',
                            'bg-yellow-100 text-yellow-800': reservation.paymentStatus === 'PENDING',
                            'bg-red-100 text-red-800': reservation.paymentStatus === 'CANCELLED'
                          }">
                      {{ getStatusText(reservation.paymentStatus || '') }}
                    </span>
                  </div>
                  
                  <div class="flex items-center text-gray-500 mb-3">
                    <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{{ reservation.hotelCity }}</span>
                  </div>

                  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span class="font-medium">Arrivée:</span>
                      <div>{{ formatDate(reservation.startDate) }}</div>
                    </div>
                    <div>
                      <span class="font-medium">Départ:</span>
                      <div>{{ formatDate(reservation.endDate) }}</div>
                    </div>
                    <div>
                      <span class="font-medium">Chambres:</span>
                      <div>{{ reservation.numberOfRooms }}</div>
                    </div>
                    <div>
                      <span class="font-medium">Invités:</span>
                      <div>{{ reservation.numberOfGuests }}</div>
                    </div>
                  </div>
                </div>

                <div class="mt-4 lg:mt-0 lg:ml-6 flex flex-col items-end">
                  <div class="text-2xl font-bold text-red-600 mb-4">
                    {{ reservation.totalPrice }} MAD
                  </div>
                  
                  <div class="flex space-x-3">
                    <button *ngIf="reservation.paymentStatus !== 'CANCELLED'" 
                            (click)="showReservationDetails(reservation)"
                            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Détails
                    </button>
                    <button *ngIf="reservation.paymentStatus === 'PENDING' || reservation.paymentStatus === 'CONFIRMED'" 
                            (click)="cancelReservation(reservation)"
                            class="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700">
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation d'annulation -->
    <div *ngIf="showCancelModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Confirmer l'annulation</h3>
        <p class="text-sm text-gray-500 mb-6">
          Êtes-vous sûr de vouloir annuler cette réservation ? Cette action ne peut pas être annulée.
        </p>
        <div class="flex space-x-4">
          <button (click)="showCancelModal = false" 
                  class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded">
            Non, garder
          </button>
          <button (click)="confirmCancelReservation()" 
                  class="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded">
            Oui, annuler
          </button>
        </div>
      </div>
    </div>
  `
})
export class UserReservationsComponent implements OnInit {
  reservations: HotelReservationDTO[] = [];
  userEmail: string = '';
  userDropdownOpen = false;
  isLoading = true;
  showCancelModal = false;
  reservationToCancel: HotelReservationDTO | null = null;

  constructor(
    private reservationService: HotelReservationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserEmail();
    this.loadUserReservations();
  }

  loadUserEmail() {
    const user = this.authService.getAuthenticatedUser();
    if (user && user.email) {
      this.userEmail = user.email;
    } else {
      this.userEmail = 'Invité';
    }
  }

 loadUserReservations() {
  const user = this.authService.getAuthenticatedUser();
  if (user && user.id) {
    this.reservationService.getUserReservations(user.id).subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des réservations:', error);
        this.isLoading = false;
      }
    });
  } else {
    this.isLoading = false;
  }
}


  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'CONFIRMED': return 'Confirmée';
      case 'PENDING': return 'En attente';
      case 'CANCELLED': return 'Annulée';
      default: return 'Inconnu';
    }
  }

  showReservationDetails(reservation: HotelReservationDTO) {
    // Implémenter la logique pour afficher les détails
    console.log('Détails de la réservation:', reservation);
  }

  cancelReservation(reservation: HotelReservationDTO) {
    this.reservationToCancel = reservation;
    this.showCancelModal = true;
  }

  confirmCancelReservation() {
    if (this.reservationToCancel && this.reservationToCancel.id) {
      this.reservationService.cancelReservation(this.reservationToCancel.id).subscribe({
        next: () => {
          this.loadUserReservations(); // Recharger la liste
          this.showCancelModal = false;
          this.reservationToCancel = null;
        },
        error: (error) => {
          console.error('Erreur lors de l\'annulation:', error);
          this.showCancelModal = false;
        }
      });
    }
  }

  navigateToHotels() {
    this.router.navigate(['/user/hotels']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}