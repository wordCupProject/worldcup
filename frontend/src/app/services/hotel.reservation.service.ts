import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service'; // Importer votre AuthService

export interface HotelReservationDTO {
  id?: number;
  userId: number;
  userEmail?: string;
  hotelId: number;
  hotelName?: string;
  hotelCity?: string;
  startDate: string;
  endDate: string;
  numberOfRooms: number;
  numberOfGuests: number;
  totalPrice?: number;
  paymentStatus?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HotelReservationService {
  private apiUrl = 'http://localhost:8081/api/hotel-reservations';

  constructor(
    private http: HttpClient,
    private authService: AuthService // Ajouter AuthService
  ) {}

  createReservation(reservation: HotelReservationDTO): Observable<HotelReservationDTO> {
    console.log('🚀 Creating reservation with data:', reservation);
    
    // Vérifier l'authentification avant de créer la réservation
    if (!this.authService.isAuthenticated()) {
      console.error('❌ User not authenticated for reservation');
      this.authService.debugToken();
      return throwError(() => new Error('Vous devez être connecté pour faire une réservation'));
    }

    // Nettoyer et valider les données avant envoi
    const cleanReservation = this.prepareReservationData(reservation);
    console.log('📦 Cleaned reservation data:', cleanReservation);
    
    // Utiliser les headers avec authentification
    const headers = this.createAuthHeaders();

    console.log('🌐 Making HTTP POST request to:', this.apiUrl);
    console.log('📋 Request headers:', headers);
    console.log('📄 Request body:', JSON.stringify(cleanReservation, null, 2));

    return this.http.post<HotelReservationDTO>(this.apiUrl, cleanReservation, { headers })
      .pipe(
        tap(response => {
          console.log('✅ Reservation created successfully:', response);
        }),
        catchError((error) => {
          console.error('❌ HTTP Request failed');
          console.error('Request URL:', this.apiUrl);
          console.error('Request Data:', cleanReservation);
          return this.handleError(error);
        })
      );
  }

  private createAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token && this.authService.isAuthenticated()) {
      headers = headers.set('Authorization', `Bearer ${token}`);
      console.log('🔐 Adding Authorization header to reservation request');
      
      const user = this.authService.getAuthenticatedUser();
      console.log('👤 Making reservation request for user:', user);
    } else {
      console.warn('⚠️ No valid auth token found for reservation - this may cause 401 errors');
      
      if (token) {
        console.warn('⚠️ Token exists but authentication check failed');
        this.authService.debugToken();
      }
    }

    return headers;
  }

  private prepareReservationData(reservation: HotelReservationDTO): any {
    // S'assurer que tous les champs numériques sont bien des nombres
    const cleaned = {
      userId: Number(reservation.userId),
      hotelId: Number(reservation.hotelId),
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      numberOfRooms: Number(reservation.numberOfRooms),
      numberOfGuests: Number(reservation.numberOfGuests)
    };

    // Si userId n'est pas fourni, essayer de le récupérer du token
    if (!cleaned.userId || cleaned.userId <= 0) {
      const user = this.authService.getAuthenticatedUser();
      if (user && user.id) {
        cleaned.userId = user.id;
        console.log('✅ User ID retrieved from token:', cleaned.userId);
      } else {
        throw new Error('Impossible de déterminer l\'ID utilisateur. Veuillez vous reconnecter.');
      }
    }

    // Validation des données
    if (!cleaned.userId || cleaned.userId <= 0) {
      throw new Error('User ID invalide: ' + cleaned.userId);
    }
    
    if (!cleaned.hotelId || cleaned.hotelId <= 0) {
      throw new Error('Hotel ID invalide: ' + cleaned.hotelId);
    }
    
    if (!cleaned.startDate || !cleaned.endDate) {
      throw new Error('Les dates sont obligatoires');
    }
    
    // Vérifier que les dates sont au bon format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(cleaned.startDate) || !dateRegex.test(cleaned.endDate)) {
      throw new Error('Format de date invalide. Utilisez YYYY-MM-DD');
    }
    
    if (cleaned.numberOfRooms <= 0 || cleaned.numberOfGuests <= 0) {
      throw new Error('Le nombre de chambres et d\'invités doit être supérieur à 0');
    }

    console.log('✅ Reservation data validated:', cleaned);
    return cleaned;
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    console.error('❌ Reservation service error:', error);
    console.error('❌ Error status:', error.status);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error body:', error.error);
    
    let errorMessage = 'Une erreur inconnue est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur client: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      console.error('=== DETAILED ERROR INFO ===');
      console.error('Status:', error.status);
      console.error('Status Text:', error.statusText);
      console.error('URL:', error.url);
      console.error('Headers:', error.headers);
      console.error('Error Object:', error.error);
      console.error('=== END ERROR INFO ===');
      
      switch (error.status) {
        case 400:
          // Essayer de récupérer le message d'erreur spécifique du backend
          if (error.error) {
            if (typeof error.error === 'string') {
              errorMessage = `Erreur 400: ${error.error}`;
            } else if (error.error.message) {
              errorMessage = `Erreur 400: ${error.error.message}`;
            } else if (error.error.error) {
              errorMessage = `Erreur 400: ${error.error.error}`;
            } else if (error.error.errors) {
              // Spring Boot validation errors
              if (Array.isArray(error.error.errors)) {
                errorMessage = `Erreurs de validation: ${error.error.errors.join(', ')}`;
              } else {
                const validationErrors = Object.values(error.error.errors).join(', ');
                errorMessage = `Erreurs de validation: ${validationErrors}`;
              }
            } else {
              // Afficher tout l'objet d'erreur pour debug
              errorMessage = `Erreur 400: ${JSON.stringify(error.error)}`;
            }
          } else {
            errorMessage = 'Données de réservation invalides (400 - aucun détail disponible)';
          }
          break;
        case 401:
          errorMessage = 'Session expirée. Veuillez vous reconnecter.';
          this.handleAuthError();
          break;
        case 403:
          errorMessage = 'Accès refusé.';
          break;
        case 404:
          errorMessage = 'Service de réservation non trouvé.';
          break;
        case 500:
          errorMessage = 'Erreur interne du serveur. Veuillez réessayer plus tard.';
          break;
        case 0:
          errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.statusText || error.message}`;
      }
    }
    
    console.error('🔴 Final error message:', errorMessage);
    return throwError(() => new Error(errorMessage));
  };

  private handleAuthError(): void {
    console.log('🔄 Authentication error in reservation service - logging out user');
    this.authService.logout();
    console.log('🔄 User logged out due to authentication error');
  }

  getUserReservations(userId?: number): Observable<HotelReservationDTO[]> {
    // Si userId n'est pas fourni, utiliser celui du token
    if (!userId) {
      const user = this.authService.getAuthenticatedUser();
      if (user && user.id) {
        userId = user.id;
      } else {
        return throwError(() => new Error('Impossible de déterminer l\'ID utilisateur'));
      }
    }

    const headers = this.createAuthHeaders();
    return this.http.get<HotelReservationDTO[]>(`${this.apiUrl}/user/${userId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  getAllReservations(): Observable<HotelReservationDTO[]> {
    const headers = this.createAuthHeaders();
    return this.http.get<HotelReservationDTO[]>(this.apiUrl, { headers })
      .pipe(catchError(this.handleError));
  }

  getReservationById(id: number): Observable<HotelReservationDTO> {
    const headers = this.createAuthHeaders();
    return this.http.get<HotelReservationDTO>(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  cancelReservation(id: number): Observable<string> {
    const headers = this.createAuthHeaders();
    return this.http.put<string>(`${this.apiUrl}/${id}/cancel`, {}, { headers })
      .pipe(catchError(this.handleError));
  }

  updateReservationStatus(id: number, status: string): Observable<HotelReservationDTO> {
    const headers = this.createAuthHeaders();
    return this.http.put<HotelReservationDTO>(`${this.apiUrl}/${id}/status`, null, {
      headers,
      params: { status }
    }).pipe(catchError(this.handleError));
  }

  deleteReservation(id: number): Observable<string> {
    const headers = this.createAuthHeaders();
    return this.http.delete<string>(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }
}