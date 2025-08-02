import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service'; // Importer votre AuthService

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
  transactionId?: string;
  paymentDate?: string;
  failureReason?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8081/api/payments';

  constructor(
    private http: HttpClient,
    private authService: AuthService // Injecter le AuthService
  ) {}

  makePayment(payment: PaymentDTO): Observable<PaymentDTO> {
    console.log('🚀 Processing payment with data:', payment);
    
    // Nettoyer et valider les données avant envoi
    const cleanPayment = this.preparePaymentData(payment);
    console.log('📦 Cleaned payment data:', cleanPayment);
    
    // Créer les headers avec le token JWT
    const headers = this.createAuthHeaders();

    console.log('🌐 Making HTTP POST request to:', `${this.apiUrl}/pay`);
    
    return this.http.post<PaymentDTO>(`${this.apiUrl}/pay`, cleanPayment, { headers })
      .pipe(
        tap(response => {
          console.log('✅ Payment processed successfully:', response);
        }),
        catchError(this.handleError)
      );
  }

  private createAuthHeaders(): HttpHeaders {
    // Utiliser votre AuthService pour récupérer le token
    const token = this.authService.getToken();
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token && this.authService.isAuthenticated()) {
      headers = headers.set('Authorization', `Bearer ${token}`);
      console.log('🔐 Adding Authorization header with token');
      
      // Debug de l'utilisateur authentifié
      const user = this.authService.getAuthenticatedUser();
      console.log('👤 Current authenticated user:', user);
    } else {
      console.warn('⚠️ No valid auth token found - this may cause 401 errors');
      
      // Optionnel: débugger le token
      if (token) {
        console.warn('⚠️ Token exists but authentication check failed');
        this.authService.debugToken();
      }
    }

    return headers;
  }

  private getAuthToken(): string | null {
    // Utiliser directement le AuthService
    return this.authService.getToken();
  }

  private isTokenExpired(token: string): boolean {
    // Déléguer au AuthService qui utilise JwtHelperService
    return !this.authService.isAuthenticated();
  }

  private removeExpiredToken(): void {
    // Utiliser la méthode logout du AuthService
    console.log('🔄 Token expired, logging out...');
    this.authService.logout();
  }

  private preparePaymentData(payment: PaymentDTO): any {
    const cleaned: any = {
      reservationId: Number(payment.reservationId),
      amount: Number(payment.amount),
      paymentMethod: payment.paymentMethod
    };

    // Ajouter les informations de carte si c'est un paiement par carte
    if (payment.paymentMethod === 'CREDIT_CARD' || payment.paymentMethod === 'DEBIT_CARD') {
      cleaned.cardHolderName = payment.cardHolderName;
      cleaned.cardNumber = payment.cardNumber?.replace(/\s+/g, ''); // Enlever les espaces
      cleaned.expiryDate = payment.expiryDate;
      cleaned.cvv = payment.cvv;
    }

    // Validation des données
    if (!cleaned.reservationId || cleaned.reservationId <= 0) {
      throw new Error('ID de réservation invalide: ' + cleaned.reservationId);
    }
    
    if (!cleaned.amount || cleaned.amount <= 0) {
      throw new Error('Montant invalide: ' + cleaned.amount);
    }
    
    if (!cleaned.paymentMethod) {
      throw new Error('Méthode de paiement requise');
    }

    console.log('✅ Payment data validated:', cleaned);
    return cleaned;
  }

  getPaymentsByReservation(reservationId: number): Observable<PaymentDTO> {
    const headers = this.createAuthHeaders();
    return this.http.get<PaymentDTO>(`${this.apiUrl}/by-reservation/${reservationId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  getPaymentById(id: number): Observable<PaymentDTO> {
    const headers = this.createAuthHeaders();
    return this.http.get<PaymentDTO>(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  refundPayment(paymentId: number): Observable<PaymentDTO> {
    const headers = this.createAuthHeaders();
    return this.http.post<PaymentDTO>(`${this.apiUrl}/refund/${paymentId}`, {}, { headers })
      .pipe(catchError(this.handleError));
  }

  cancelPayment(paymentId: number): Observable<PaymentDTO> {
    const headers = this.createAuthHeaders();
    return this.http.post<PaymentDTO>(`${this.apiUrl}/cancel/${paymentId}`, {}, { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    console.error('❌ Payment service error:', error);
    
    let errorMessage = 'Une erreur inconnue est survenue lors du paiement';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur client: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      console.error('Status:', error.status);
      console.error('Error body:', error.error);
      
      switch (error.status) {
        case 400:
          if (error.error?.message) {
            errorMessage = `Erreur de paiement: ${error.error.message}`;
          } else {
            errorMessage = 'Données de paiement invalides';
          }
          break;
        case 401:
          errorMessage = 'Session expirée. Veuillez vous reconnecter.';
          // Gérer l'erreur d'authentification avec votre AuthService
          this.handleAuthError();
          break;
        case 402:
          errorMessage = 'Paiement refusé. Vérifiez vos informations de carte.';
          break;
        case 403:
          errorMessage = 'Accès interdit. Vous n\'avez pas les droits nécessaires.';
          break;
        case 404:
          errorMessage = 'Réservation non trouvée.';
          break;
        case 500:
          errorMessage = 'Erreur du serveur de paiement. Veuillez réessayer.';
          break;
        case 0:
          errorMessage = 'Impossible de contacter le serveur de paiement.';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.statusText || 'Erreur de paiement'}`;
      }
    }
    
    console.error('🔴 Final payment error message:', errorMessage);
    return throwError(() => new Error(errorMessage));
  };

  private handleAuthError(): void {
    // Utiliser le AuthService pour gérer la déconnexion
    console.log('🔄 Authentication error - logging out user');
    this.authService.logout();
    
    // Optionnel: vous pouvez émettre un événement ou rediriger
    // Exemple: window.location.href = '/login';
    console.log('🔄 User logged out due to authentication error');
  }
}