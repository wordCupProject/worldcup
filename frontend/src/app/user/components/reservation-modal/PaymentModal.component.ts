import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService, PaymentDTO, PaymentMethod } from '../../../services/payment.service';

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-screen overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Paiement de la réservation</h2>
          <button (click)="closeModal()" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Résumé de la réservation -->
        <div class="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">Résumé de la réservation</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span>Hôtel:</span>
              <span class="font-medium">{{ reservationSummary?.hotelName }}</span>
            </div>
            <div class="flex justify-between">
              <span>Dates:</span>
              <span class="font-medium">{{ formatDateRange() }}</span>
            </div>
            <div class="flex justify-between">
              <span>Chambres:</span>
              <span class="font-medium">{{ reservationSummary?.numberOfRooms }}</span>
            </div>
            <div class="flex justify-between">
              <span>Invités:</span>
              <span class="font-medium">{{ reservationSummary?.numberOfGuests }}</span>
            </div>
            <hr class="my-2">
            <div class="flex justify-between text-lg font-bold text-red-600">
              <span>Total à payer:</span>
              <span>{{ reservationSummary?.totalPrice }} MAD</span>
            </div>
          </div>
        </div>

        <form (ngSubmit)="onSubmit()" #paymentForm="ngForm">
          <!-- Méthode de paiement -->
          <div class="mb-6">
            <label class="block text-gray-700 font-medium mb-3">Méthode de paiement</label>
            <div class="space-y-3">
              <div class="flex items-center">
                <input 
                  type="radio" 
                  id="credit_card" 
                  name="paymentMethod" 
                  value="CREDIT_CARD"
                  [(ngModel)]="payment.paymentMethod" 
                  class="mr-3">
                <label for="credit_card" class="flex items-center cursor-pointer">
                  <svg class="w-8 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 10h20v2H2zm0 4h20v6H2z"/>
                  </svg>
                  Carte de crédit
                </label>
              </div>
              
              <div class="flex items-center">
                <input 
                  type="radio" 
                  id="debit_card" 
                  name="paymentMethod" 
                  value="DEBIT_CARD"
                  [(ngModel)]="payment.paymentMethod" 
                  class="mr-3">
                <label for="debit_card" class="flex items-center cursor-pointer">
                  <svg class="w-8 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 10h20v2H2zm0 4h20v6H2z"/>
                  </svg>
                  Carte de débit
                </label>
              </div>

              <div class="flex items-center">
                <input 
                  type="radio" 
                  id="paypal" 
                  name="paymentMethod" 
                  value="PAYPAL"
                  [(ngModel)]="payment.paymentMethod" 
                  class="mr-3">
                <label for="paypal" class="flex items-center cursor-pointer">
                  <svg class="w-8 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a.641.641 0 0 1-.633-.74l.158-1.006C21.098 2.287 20.815 0 18.644 0h-7.46c-.524 0-.972.382-1.054.901L6.023 21.228a.641.641 0 0 0 .633.74h4.606c.524 0 .968-.382 1.05-.9l1.12-7.106h2.19c4.298 0 7.664-1.747 8.647-6.797.03-.149.054-.294.077-.437.292-1.867-.002-3.137-1.012-4.287C22.222 1.273 20.214.73 17.644.73"/>
                  </svg>
                  PayPal
                </label>
              </div>

              <div class="flex items-center">
                <input 
                  type="radio" 
                  id="bank_transfer" 
                  name="paymentMethod" 
                  value="BANK_TRANSFER"
                  [(ngModel)]="payment.paymentMethod" 
                  class="mr-3">
                <label for="bank_transfer" class="flex items-center cursor-pointer">
                  <svg class="w-8 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 10.5 5.16-.76 9-4.95 9-10.5V7l-10-5z"/>
                  </svg>
                  Virement bancaire
                </label>
              </div>
            </div>
          </div>

          <!-- Informations de carte (affichées si carte sélectionnée) -->
          <div *ngIf="isCardPayment()" class="space-y-4 mb-6 p-4 border border-gray-200 rounded-lg">
            <h4 class="font-medium text-gray-700">Informations de la carte</h4>
            
            <div>
              <label class="block text-gray-700 font-medium mb-2">Nom du titulaire</label>
              <input 
                type="text" 
                [(ngModel)]="payment.cardHolderName" 
                name="cardHolderName"
                [required]="isCardPayment()"
                placeholder="Nom complet tel qu'il apparaît sur la carte"
                class="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent">
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">Numéro de carte</label>
              <input 
                type="text" 
                [(ngModel)]="payment.cardNumber" 
                name="cardNumber"
                [required]="isCardPayment()"
                placeholder="1234 5678 9012 3456"
                maxlength="19"
                (input)="formatCardNumber($event)"
                class="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent">
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-700 font-medium mb-2">Date d'expiration</label>
                <input 
                  type="text" 
                  [(ngModel)]="payment.expiryDate" 
                  name="expiryDate"
                  [required]="isCardPayment()"
                  placeholder="MM/YY"
                  maxlength="5"
                  (input)="formatExpiryDate($event)"
                  class="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent">
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">CVV</label>
                <input 
                  type="text" 
                  [(ngModel)]="payment.cvv" 
                  name="cvv"
                  [required]="isCardPayment()"
                  placeholder="123"
                  maxlength="4"
                  class="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent">
              </div>
            </div>
          </div>

          <!-- Messages d'information pour autres méthodes -->
          <div *ngIf="payment.paymentMethod === 'PAYPAL'" class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p class="text-blue-800 text-sm">
              <svg class="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
              </svg>
              Vous serez redirigé vers PayPal pour finaliser le paiement.
            </p>
          </div>

          <div *ngIf="payment.paymentMethod === 'BANK_TRANSFER'" class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p class="text-yellow-800 text-sm">
              <svg class="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
              </svg>
              Un virement bancaire peut prendre 2-3 jours ouvrables à être traité.
            </p>
          </div>

          <!-- Messages d'état -->
          <div *ngIf="errorMessage" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <svg class="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            {{ errorMessage }}
          </div>

          <div *ngIf="successMessage" class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <svg class="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            {{ successMessage }}
          </div>

          <!-- Informations de sécurité -->
          <div class="mb-6 p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
              </svg>
              Paiement sécurisé SSL - Vos informations sont protégées
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex space-x-4">
            <button 
              type="button" 
              (click)="closeModal()"
              class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-lg transition duration-300">
              Annuler
            </button>
            <button 
              type="submit" 
              [disabled]="!paymentForm.valid || isLoading || !payment.paymentMethod"
              class="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="!isLoading" class="flex items-center justify-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                Payer {{ reservationSummary?.totalPrice }} MAD
              </span>
              <span *ngIf="isLoading" class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Traitement en cours...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class PaymentModalComponent implements OnInit, OnChanges {
  @Input() isVisible: boolean = false;
  @Input() reservationSummary: any = null;
  @Output() modalClosed = new EventEmitter<void>();
  @Output() paymentCompleted = new EventEmitter<PaymentDTO>();

  payment: PaymentDTO = {
    reservationId: 0,
    amount: 0,
    paymentMethod: null,
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  };

  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private paymentService: PaymentService) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.reservationSummary && this.isVisible) {
      this.payment.reservationId = this.reservationSummary.id;
      this.payment.amount = this.reservationSummary.totalPrice;
      
      // Reset les messages et états
      this.errorMessage = '';
      this.successMessage = '';
      this.isLoading = false;
    }
  }

  isCardPayment(): boolean {
    return this.payment.paymentMethod === 'CREDIT_CARD' || this.payment.paymentMethod === 'DEBIT_CARD';
  }

  formatDateRange(): string {
    if (this.reservationSummary?.startDate && this.reservationSummary?.endDate) {
      const startDate = new Date(this.reservationSummary.startDate);
      const endDate = new Date(this.reservationSummary.endDate);
      return `${startDate.toLocaleDateString('fr-FR')} - ${endDate.toLocaleDateString('fr-FR')}`;
    }
    return '';
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    event.target.value = formattedValue;
    this.payment.cardNumber = value;
  }

  formatExpiryDate(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    event.target.value = value;
    this.payment.expiryDate = value;
  }

  onSubmit() {
    // Validation de base
    if (!this.payment.paymentMethod) {
      this.errorMessage = 'Veuillez sélectionner une méthode de paiement';
      return;
    }

    // Validation spécifique pour les cartes
    if (this.isCardPayment()) {
      if (!this.payment.cardHolderName || !this.payment.cardNumber || 
          !this.payment.expiryDate || !this.payment.cvv) {
        this.errorMessage = 'Veuillez remplir toutes les informations de la carte';
        return;
      }

      // Validation basique du numéro de carte
      if (this.payment.cardNumber.replace(/\s/g, '').length < 13) {
        this.errorMessage = 'Numéro de carte invalide';
        return;
      }

      // Validation de la date d'expiration
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(this.payment.expiryDate)) {
        this.errorMessage = 'Date d\'expiration invalide (MM/YY)';
        return;
      }

      // Validation du CVV
      if (!/^\d{3,4}$/.test(this.payment.cvv)) {
        this.errorMessage = 'CVV invalide';
        return;
      }
    }

    // Formater la date pour le backend
    if (this.isCardPayment() && this.payment.expiryDate) {
      const [month, year] = this.payment.expiryDate.split('/');
      this.payment.expiryDate = `20${year}-${month}`;
    }

    this.processPayment();
  }

  private processPayment() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Nettoyer les données de la carte
    const paymentData: PaymentDTO = {
      ...this.payment,
      cardNumber: this.payment.cardNumber?.replace(/\s+/g, '') || ''
    };

    this.paymentService.makePayment(paymentData).subscribe({
      next: (completedPayment) => {
        this.isLoading = false;
        
        if (completedPayment.paymentStatus === 'CONFIRMED') {
          this.successMessage = 'Paiement effectué avec succès !';
          this.paymentCompleted.emit(completedPayment);
          
          setTimeout(() => this.closeModal(), 2000);
        } else {
          this.errorMessage = completedPayment.failureReason || 'Le paiement a échoué. Veuillez réessayer.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Erreur lors du traitement du paiement. Veuillez réessayer.';
      }
    });
  }

  closeModal() {
    this.isVisible = false;
    this.resetForm();
    this.modalClosed.emit();
  }

  private resetForm() {
    this.payment = {
      reservationId: 0,
      amount: 0,
      paymentMethod: null,
      cardHolderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    };
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = false;
  }
}