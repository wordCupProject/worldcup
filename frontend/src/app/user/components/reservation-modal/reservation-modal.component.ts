import { Component, Input, Output, EventEmitter } from '@angular/core';
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
              [disabled]="!reservationForm.valid || isLoading"
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
export class ReservationModalComponent {
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

  constructor(
    private reservationService: HotelReservationService,
    private authService: AuthService
  ) {
    this.today = new Date().toISOString().split('T')[0];
  }

  ngOnInit() {
    const user = this.authService.getAuthenticatedUser();
    if (user && 'id' in user) {
      this.reservation.userId = (user as any).id; // ou mieux : créer un type propre
    }
  }

  ngOnChanges() {
    if (this.hotel) {
      this.reservation.hotelId = this.hotel.id || 0;
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
    if (!this.reservation.userId) {
      this.errorMessage = 'Vous devez être connecté pour faire une réservation';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.reservationService.createReservation(this.reservation).subscribe({
      next: (createdReservation) => {
        this.isLoading = false;
        this.successMessage = 'Réservation créée avec succès !';
        this.reservationCreated.emit(createdReservation);
        
        setTimeout(() => {
          this.closeModal();
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors de la création de la réservation. Veuillez réessayer.';
        console.error('Erreur réservation:', error);
      }
    });
  }

  closeModal() {
    this.isVisible = false;
    this.reservation = {
      userId: this.reservation.userId,
      hotelId: 0,
      startDate: '',
      endDate: '',
      numberOfRooms: 1,
      numberOfGuests: 1
    };
    this.errorMessage = '';
    this.successMessage = '';
    this.modalClosed.emit();
  }
}