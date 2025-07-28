import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotelReservationService, HotelReservationDTO } from '../../../services/hotel.reservation.service';
import { AuthService } from '../../../services/auth.service';

interface Hotel {
  id?: number;
  title: string;
  city: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-reservation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-gray-800">Réserver {{ hotel?.title }}</h2>
          <button (click)="closeModal()" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Debug info (à supprimer en production) -->
        <div class="mb-4 p-2 bg-gray-100 text-xs">
          <p>User ID: {{ reservation.userId }}</p>
          <p>Hotel ID: {{ reservation.hotelId }}</p>
          <p>Is Authenticated: {{ isAuthenticated }}</p>
          <p>User Object: {{ userDebugInfo }}</p>
          <div class="mt-2 space-x-1">
            <button 
              type="button" 
              (click)="debugAuth()" 
              class="px-2 py-1 bg-blue-500 text-white text-xs rounded">
              Debug Token
            </button>
            <button 
              type="button" 
              (click)="testReservationData()" 
              class="px-2 py-1 bg-green-500 text-white text-xs rounded">
              Test API
            </button>
            <button 
              type="button" 
              (click)="forceReloadUser()" 
              class="px-2 py-1 bg-orange-500 text-white text-xs rounded">
              Force Reload
            </button>
            <button 
              type="button" 
              (click)="performCompleteTest()" 
              class="px-2 py-1 bg-purple-500 text-white text-xs rounded">
              Complete Test
            </button>
          </div>
        </div>

        <form (ngSubmit)="onSubmit()" #reservationForm="ngForm">
          <div class="space-y-4">
            <div>
              <label class="block text-gray-700 font-medium mb-2">Date d'arrivée</label>
              <input 
                type="date" 
                [(ngModel)]="reservation.startDate" 
                name="startDate"
                required
                [min]="today"
                class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent">
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">Date de départ</label>
              <input 
                type="date" 
                [(ngModel)]="reservation.endDate" 
                name="endDate"
                required
                [min]="reservation.startDate || today"
                class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent">
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-700 font-medium mb-2">Nombre de chambres</label>
                <select 
                  [(ngModel)]="reservation.numberOfRooms" 
                  name="numberOfRooms"
                  required
                  class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="1">1 chambre</option>
                  <option value="2">2 chambres</option>
                  <option value="3">3 chambres</option>
                  <option value="4">4 chambres</option>
                  <option value="5">5+ chambres</option>
                </select>
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">Nombre d'invités</label>
                <select 
                  [(ngModel)]="reservation.numberOfGuests" 
                  name="numberOfGuests"
                  required
                  class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="1">1 personne</option>
                  <option value="2">2 personnes</option>
                  <option value="3">3 personnes</option>
                  <option value="4">4 personnes</option>
                  <option value="5">5+ personnes</option>
                </select>
              </div>
            </div>

            <div *ngIf="totalPrice > 0" class="bg-gray-50 p-4 rounded-md">
              <div class="flex justify-between items-center">
                <span class="text-gray-700">Prix total:</span>
                <span class="text-2xl font-bold text-red-600">{{ totalPrice }} MAD</span>
              </div>
              <div class="text-sm text-gray-500 mt-1">
                {{ numberOfNights }} nuit(s) × {{ reservation.numberOfRooms }} chambre(s) × 1000 MAD
              </div>
            </div>
          </div>

          <div class="flex space-x-4 mt-6">
            <button 
              type="button" 
              (click)="closeModal()"
              class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded transition duration-300">
              Annuler
            </button>
            <button 
              type="submit" 
              [disabled]="!reservationForm.valid || isLoading || !isAuthenticated || reservation.userId <= 0"
              class="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="!isLoading">Confirmer la réservation</span>
              <span *ngIf="isLoading">Réservation en cours...</span>
            </button>
          </div>
        </form>

        <div *ngIf="errorMessage" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ errorMessage }}
        </div>

        <div *ngIf="successMessage" class="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {{ successMessage }}
        </div>
      </div>
    </div>
  `
})
export class ReservationModalComponent implements OnInit, OnChanges {
  @Input() isVisible: boolean = false;
  @Input() hotel: Hotel | null = null;
  @Output() modalClosed = new EventEmitter<void>();
  @Output() reservationCreated = new EventEmitter<HotelReservationDTO>();

  reservation: HotelReservationDTO = {
    userId: 0,
    hotelId: 0,
    startDate: '',
    endDate: '',
    numberOfRooms: 1,
    numberOfGuests: 1
  };

  today: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  isAuthenticated: boolean = false;
  userDebugInfo: string = '';

  constructor(
    private reservationService: HotelReservationService,
    private authService: AuthService
  ) {
    this.today = new Date().toISOString().split('T')[0];
  }

  ngOnInit() {
    console.log('ReservationModal ngOnInit called');
    this.loadUserInfo();
  }

  ngOnChanges() {
    console.log('ReservationModal ngOnChanges called');
    console.log('Hotel:', this.hotel);
    console.log('IsVisible:', this.isVisible);
    
    // Charger les infos utilisateur à chaque changement
    this.loadUserInfo();
    
    // Configurer l'hôtel si disponible
    if (this.hotel && this.hotel.id) {
      this.reservation.hotelId = this.hotel.id;
      console.log('Hotel ID set to:', this.reservation.hotelId);
    }
    
    // Reset les messages d'erreur quand le modal s'ouvre
    if (this.isVisible) {
      this.errorMessage = '';
      this.successMessage = '';
    }
  }

  private loadUserInfo() {
    console.log('🔄 Loading user info...');
    
    // Vérifier l'authentification
    this.isAuthenticated = this.authService.isAuthenticated();
    console.log('Is authenticated:', this.isAuthenticated);
    
    if (this.isAuthenticated) {
      const user = this.authService.getAuthenticatedUser();
      console.log('🔍 Authenticated user:', user);
      
      // Mettre à jour l'info de debug
      this.userDebugInfo = JSON.stringify(user);
      
      if (user && user.id && user.id > 0) {
        this.reservation.userId = user.id;
        console.log('✅ User ID set to:', this.reservation.userId);
        this.errorMessage = ''; // Clear any previous error
      } else {
        console.error('❌ User ID not found or invalid in token');
        console.error('User object:', user);
        
        this.reservation.userId = 0;
        this.errorMessage = '❌ Impossible de récupérer votre identifiant. Token: ' + (user ? JSON.stringify(user) : 'null');
        
        // Forcer un test complet du token
        console.log('🧪 Performing complete token test...');
        this.authService.performCompleteTokenTest();
      }
    } else {
      console.log('❌ User not authenticated');
      this.reservation.userId = 0;
      this.userDebugInfo = 'Not authenticated';
      this.errorMessage = 'Vous devez être connecté pour faire une réservation';
    }
  }

  get numberOfNights(): number {
    if (this.reservation.startDate && this.reservation.endDate) {
      const start = new Date(this.reservation.startDate);
      const end = new Date(this.reservation.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  }

  get totalPrice(): number {
    if (this.numberOfNights > 0 && this.reservation.numberOfRooms > 0) {
      return this.numberOfNights * this.reservation.numberOfRooms * 1000;
    }
    return 0;
  }

  onSubmit() {
    console.log('🚀 Form submitted');
    console.log('Reservation data before validation:', this.reservation);
    
    // Vérifications préliminaires avec messages plus détaillés
    if (!this.authService.isAuthenticated()) {
      this.errorMessage = 'Vous devez être connecté pour faire une réservation';
      console.error('❌ User not authenticated');
      return;
    }

    if (!this.reservation.userId || this.reservation.userId === 0) {
      this.errorMessage = 'Erreur d\'identification utilisateur. ID: ' + this.reservation.userId + '. Veuillez vous reconnecter.';
      console.error('❌ User ID is 0 or undefined:', this.reservation.userId);
      
      // Essayer de recharger les infos utilisateur une dernière fois
      console.log('🔄 Attempting emergency user reload...');
      this.loadUserInfo();
      
      if (this.reservation.userId <= 0) {
        console.error('❌ Emergency reload failed, cannot proceed with reservation');
        return;
      }
    }

    if (!this.reservation.hotelId || this.reservation.hotelId === 0) {
      this.errorMessage = 'Erreur d\'identification de l\'hôtel. Veuillez réessayer.';
      console.error('❌ Hotel ID is 0 or undefined:', this.reservation.hotelId);
      return;
    }

    // Validation des dates
    if (!this.reservation.startDate || !this.reservation.endDate) {
      this.errorMessage = 'Veuillez sélectionner les dates d\'arrivée et de départ.';
      console.error('❌ Missing dates:', { startDate: this.reservation.startDate, endDate: this.reservation.endDate });
      return;
    }

    const startDate = new Date(this.reservation.startDate);
    const endDate = new Date(this.reservation.endDate);
    
    if (startDate >= endDate) {
      this.errorMessage = 'La date de départ doit être postérieure à la date d\'arrivée.';
      console.error('❌ Invalid date range:', { startDate, endDate });
      return;
    }

    // Validation des nombres
    if (!this.reservation.numberOfRooms || this.reservation.numberOfRooms < 1) {
      this.errorMessage = 'Le nombre de chambres doit être supérieur à 0.';
      console.error('❌ Invalid number of rooms:', this.reservation.numberOfRooms);
      return;
    }

    if (!this.reservation.numberOfGuests || this.reservation.numberOfGuests < 1) {
      this.errorMessage = 'Le nombre d\'invités doit être supérieur à 0.';
      console.error('❌ Invalid number of guests:', this.reservation.numberOfGuests);
      return;
    }

    // Log détaillé des données à envoyer
    console.log('✅ All validations passed');
    console.log('📦 Final reservation data:', {
      userId: this.reservation.userId,
      hotelId: this.reservation.hotelId,
      startDate: this.reservation.startDate,
      endDate: this.reservation.endDate,
      numberOfRooms: this.reservation.numberOfRooms,
      numberOfGuests: this.reservation.numberOfGuests
    });

    // Procéder à la réservation
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.reservationService.createReservation(this.reservation).subscribe({
      next: (createdReservation) => {
        console.log('✅ Reservation created successfully:', createdReservation);
        this.isLoading = false;
        this.successMessage = 'Réservation créée avec succès !';
        this.reservationCreated.emit(createdReservation);
        
        setTimeout(() => {
          this.closeModal();
        }, 2000);
      },
      error: (error) => {
        console.error('❌ Reservation error:', error);
        this.isLoading = false;
        
        this.errorMessage = error.message || 'Erreur lors de la création de la réservation. Veuillez réessayer.';
      }
    });
  }

  closeModal() {
    console.log('Closing modal');
    this.isVisible = false;
    this.resetForm();
    this.modalClosed.emit();
  }

  private resetForm() {
    const currentUserId = this.reservation.userId;
    
    this.reservation = {
      userId: currentUserId,
      hotelId: 0,
      startDate: '',
      endDate: '',
      numberOfRooms: 1,
      numberOfGuests: 1
    };
    
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = false;
  }

  // ✅ MÉTHODES DE DEBUG AMÉLIORÉES

  debugAuth() {
    console.log('=== 🔍 DEBUGGING AUTH ===');
    
    this.authService.debugToken();
    
    console.log('Is authenticated:', this.authService.isAuthenticated());
    
    const user = this.authService.getAuthenticatedUser();
    console.log('Current user (getAuthenticatedUser):', user);
    
    this.loadUserInfo();
    console.log('After modal reload - User ID:', this.reservation.userId);
    
    console.log('=== 🔚 END DEBUG ===');
  }

  testReservationData() {
    console.log('=== 🧪 TESTING RESERVATION DATA ===');
    console.log('Raw reservation object:', this.reservation);
    
    // Créer des données de test avec l'ID utilisateur actuel si disponible
    const currentUser = this.authService.getAuthenticatedUser();
    const testUserId = currentUser && currentUser.id > 0 ? currentUser.id : 1;
    
    const testReservation: HotelReservationDTO = {
      userId: testUserId,
      hotelId: this.hotel?.id || 1,
      startDate: '2025-08-01',
      endDate: '2025-08-03',
      numberOfRooms: 1,
      numberOfGuests: 2
    };
    
    console.log('Test reservation data:', testReservation);
    
    this.reservationService.createReservation(testReservation).subscribe({
      next: (result) => {
        console.log('✅ Test reservation successful:', result);
        alert('Test de réservation réussi !');
      },
      error: (error) => {
        console.error('❌ Test reservation failed:', error);
        alert('Échec du test de réservation : ' + error.message);
      }
    });
    
    console.log('=== 🔚 END TEST ===');
  }

  forceReloadUser() {
    console.log('🔄 Force reloading user info...');
    
    const forcedUser = this.authService.forceTokenReload();
    if (forcedUser && forcedUser.id > 0) {
      this.reservation.userId = forcedUser.id;
      console.log('✅ User ID updated from forced reload:', this.reservation.userId);
      this.userDebugInfo = JSON.stringify(forcedUser);
      this.errorMessage = '';
      alert(`User ID mis à jour: ${this.reservation.userId}`);
    } else {
      console.error('❌ Failed to reload user info');
      alert('Échec du rechargement des infos utilisateur');
    }
  }

  performCompleteTest() {
    console.log('🧪 Performing complete test...');
    this.authService.performCompleteTokenTest();
    this.loadUserInfo();
  }
}