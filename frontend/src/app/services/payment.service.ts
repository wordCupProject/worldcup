// payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'PAYPAL' | 'BANK_TRANSFER';

export interface PaymentDTO {
  id?: number;
  reservationId: number;
  amount: number;
  paymentMethod: PaymentMethod | null;
  paymentStatus?: 'PENDING' | 'CONFIRMED' | 'FAILED' | 'CANCELLED';
  cardHolderName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  paymentDate?: string;
  failureReason?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8081/api/payments';

  constructor(private http: HttpClient) {}

  makePayment(payment: PaymentDTO): Observable<PaymentDTO> {
    console.log('🚀 Processing payment with data:', payment);
    
    const cleanPayment = this.preparePaymentData(payment);
    console.log('📦 Cleaned payment data:', cleanPayment);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<PaymentDTO>(this.apiUrl, cleanPayment, { headers })
      .pipe(
        tap(response => {
          console.log('✅ Payment processed successfully:', response);
        }),
        catchError(this.handleError)
      );
  }

  private preparePaymentData(payment: PaymentDTO): any {
    const cleaned = {
      reservationId: Number(payment.reservationId),
      amount: Number(payment.amount),
      paymentMethod: payment.paymentMethod,
      cardHolderName: payment.cardHolderName || null,
      cardNumber: payment.cardNumber || null,
      expiryDate: payment.expiryDate || null,
      cvv: payment.cvv || null
    };

    // Validation
    if (!cleaned.reservationId || cleaned.reservationId <= 0) {
      throw new Error('ID de réservation invalide');
    }

    if (!cleaned.amount || cleaned.amount <= 0) {
      throw new Error('Montant invalide');
    }

    if (!cleaned.paymentMethod) {
      throw new Error('Méthode de paiement requise');
    }

    console.log('✅ Payment data validated:', cleaned);
    return cleaned;
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    console.error('❌ Payment service error:', error);
    
    let errorMessage = 'Une erreur inconnue est survenue';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur client: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          if (error.error && error.error.message) {
            errorMessage = `Erreur 400: ${error.error.message}`;
          } else {
            errorMessage = 'Données de paiement invalides';
          }
          break;
        case 401:
          errorMessage = 'Non autorisé. Veuillez vous reconnecter.';
          break;
        case 402:
          errorMessage = 'Paiement refusé. Vérifiez vos informations de carte.';
          break;
        case 403:
          errorMessage = 'Accès refusé pour cette transaction.';
          break;
        case 404:
          errorMessage = 'Service de paiement non trouvé.';
          break;
        case 500:
          errorMessage = 'Erreur du service de paiement. Veuillez réessayer.';
          break;
        case 0:
          errorMessage = 'Impossible de contacter le service de paiement.';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.statusText || error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  };

  // Méthodes additionnelles
  getPaymentsByReservation(reservationId: number): Observable<PaymentDTO[]> {
    return this.http.get<PaymentDTO[]>(`${this.apiUrl}/reservation/${reservationId}`)
      .pipe(catchError(this.handleError));
  }

  getPaymentById(paymentId: number): Observable<PaymentDTO> {
    return this.http.get<PaymentDTO>(`${this.apiUrl}/${paymentId}`)
      .pipe(catchError(this.handleError));
  }

  cancelPayment(paymentId: number): Observable<PaymentDTO> {
    return this.http.put<PaymentDTO>(`${this.apiUrl}/${paymentId}/cancel`, {})
      .pipe(catchError(this.handleError));
  }

  refundPayment(paymentId: number, amount?: number): Observable<PaymentDTO> {
    const body = amount ? { amount } : {};
    return this.http.put<PaymentDTO>(`${this.apiUrl}/${paymentId}/refund`, body)
      .pipe(catchError(this.handleError));
  }
}