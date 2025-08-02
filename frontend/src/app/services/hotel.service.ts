import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface HotelDTO {
  id?: number;
  name: string;
  city: string;
  stars: number;
  address: string;
  description?: string;
  services: string[];
  photoPath?: string; // Nouveau champ
}

@Injectable({ 
  providedIn: 'root' 
})
export class HotelService {
  private apiUrl = 'http://localhost:8081/api/hotels';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private createAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Pour les requêtes FormData, ne pas définir Content-Type
    // (le navigateur le fera automatiquement avec boundary)
    
    if (token && this.authService.isAuthenticated()) {
      headers = headers.set('Authorization', `Bearer ${token}`);
      console.log('🔐 Adding Authorization header to hotel request');
    } else {
      console.warn('⚠️ No valid auth token found for hotel request');
      
      if (token) {
        console.warn('⚠️ Token exists but authentication check failed');
        this.authService.debugToken();
      }
    }

    return headers;
  }

  private createAuthHeadersForFormData(): HttpHeaders {
    const token = this.authService.getToken();
    
    let headers = new HttpHeaders();

    if (token && this.authService.isAuthenticated()) {
      headers = headers.set('Authorization', `Bearer ${token}`);
      console.log('🔐 Adding Authorization header to hotel FormData request');
    } else {
      console.warn('⚠️ No valid auth token found for hotel FormData request');
    }

    return headers;
  }

  addHotel(hotel: HotelDTO | FormData): Observable<any> {
    if (hotel instanceof FormData) {
      // Pour FormData, utiliser des headers sans Content-Type explicite
      const headers = this.createAuthHeadersForFormData();
      return this.http.post(this.apiUrl, hotel, { headers })
        .pipe(catchError(this.handleError));
    } else {
      // Pour JSON, utiliser des headers avec Content-Type
      const headers = this.createAuthHeaders();
      return this.http.post(this.apiUrl, hotel, { headers })
        .pipe(catchError(this.handleError));
    }
  }

  getAllHotels(): Observable<HotelDTO[]> {
    // Les requêtes GET publiques peuvent ne pas nécessiter d'authentification
    // Mais ajoutons-la au cas où
    const headers = this.createAuthHeaders();
    return this.http.get<HotelDTO[]>(this.apiUrl, { headers })
      .pipe(catchError(this.handleError));
  }

  getHotelById(id: number): Observable<HotelDTO> {
    const headers = this.createAuthHeaders();
    return this.http.get<HotelDTO>(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  updateHotel(id: number, hotel: HotelDTO): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.put(`${this.apiUrl}/${id}`, hotel, { headers })
      .pipe(catchError(this.handleError));
  }

  deleteHotel(id: number): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  getImageUrl(filename: string): string {
    return `${this.apiUrl}/images/${filename}`;
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    console.error('❌ Hotel service error:', error);
    
    let errorMessage = 'Une erreur inconnue est survenue';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur client: ${error.error.message}`;
    } else {
      console.error('Status:', error.status);
      console.error('Error body:', error.error);
      
      switch (error.status) {
        case 400:
          if (error.error?.message) {
            errorMessage = `Erreur: ${error.error.message}`;
          } else {
            errorMessage = 'Données invalides';
          }
          break;
        case 401:
          errorMessage = 'Session expirée. Veuillez vous reconnecter.';
          this.handleAuthError();
          break;
        case 403:
          errorMessage = 'Accès interdit. Vous n\'avez pas les droits nécessaires.';
          break;
        case 404:
          errorMessage = 'Hôtel non trouvé.';
          break;
        case 500:
          errorMessage = 'Erreur du serveur. Veuillez réessayer.';
          break;
        case 0:
          errorMessage = 'Impossible de contacter le serveur.';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.statusText || 'Erreur serveur'}`;
      }
    }
    
    console.error('🔴 Final hotel service error message:', errorMessage);
    return throwError(() => new Error(errorMessage));
  };

  private handleAuthError(): void {
    console.log('🔄 Authentication error in hotel service - logging out user');
    this.authService.logout();
  }
}