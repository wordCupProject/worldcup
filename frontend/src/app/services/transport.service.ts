// transport.service.ts - Service complet et corrigé
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TransportReservationDTO, TransportDTO } from '../models/transport.models';

@Injectable({
  providedIn: 'root'
})
export class TransportService {
  private apiUrl = 'http://localhost:8081/api';
  private transportsUrl = `${this.apiUrl}/transports`;
  private reservationsUrl = `${this.apiUrl}/reservations`;

  constructor(private http: HttpClient) {}

  // Headers avec authentification si token disponible
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  // Gestion des erreurs
  private handleError(error: any) {
    console.error('Transport Service Error:', error);
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.status === 0) {
      errorMessage = 'Impossible de contacter le serveur';
    } else if (error.status === 401) {
      errorMessage = 'Non autorisé - veuillez vous connecter';
    } else if (error.status === 403) {
      errorMessage = 'Accès refusé';
    } else if (error.status === 404) {
      errorMessage = 'Ressource non trouvée';
    } else if (error.status >= 500) {
      errorMessage = 'Erreur du serveur';
    }
    
    return throwError(() => new Error(errorMessage));
  }

  // ====== MÉTHODES TRANSPORTS ======

  getAllTransports(): Observable<TransportDTO[]> {
    return this.http.get<TransportDTO[]>(this.transportsUrl).pipe(
      tap(transports => console.log(`Transports chargés: ${transports.length}`)),
      catchError(this.handleError)
    );
  }

  getTransportById(id: number): Observable<TransportDTO> {
    return this.http.get<TransportDTO>(`${this.transportsUrl}/${id}`).pipe(
      tap(transport => console.log(`Transport récupéré (id=${transport.id})`)),
      catchError(this.handleError)
    );
  }

  addTransport(transport: TransportDTO): Observable<TransportDTO> {
    return this.http.post<TransportDTO>(this.transportsUrl, transport, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(t => console.log(`Transport ajouté (id=${t.id})`)),
      catchError(this.handleError)
    );
  }

  updateTransport(id: number, transport: Partial<TransportDTO>): Observable<TransportDTO> {
    return this.http.put<TransportDTO>(`${this.transportsUrl}/${id}`, transport, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(t => console.log(`Transport mis à jour (id=${t.id})`)),
      catchError(this.handleError)
    );
  }

  deleteTransport(id: number): Observable<void> {
    return this.http.delete<void>(`${this.transportsUrl}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => console.log(`Transport supprimé id=${id}`)),
      catchError(this.handleError)
    );
  }

  searchTransports(params: {
    departureCity?: string;
    arrivalCity?: string;
    departureDate?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    worldCupOnly?: boolean;
    availableOnly?: boolean;
  }): Observable<TransportDTO[]> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    return this.http.get<TransportDTO[]>(`${this.transportsUrl}/search?${searchParams}`).pipe(
      tap(results => console.log(`Résultats recherche: ${results.length}`)),
      catchError(this.handleError)
    );
  }

  // ====== MÉTHODES RÉSERVATIONS ======

  getAllReservations(): Observable<TransportReservationDTO[]> {
    return this.http.get<TransportReservationDTO[]>(this.reservationsUrl, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(reservations => console.log(`Réservations chargées: ${reservations.length}`)),
      catchError(this.handleError)
    );
  }

  getUserReservations(userId: number): Observable<TransportReservationDTO[]> {
    return this.http.get<TransportReservationDTO[]>(`${this.reservationsUrl}/user/${userId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(reservations => console.log(`Réservations utilisateur ${userId}: ${reservations.length}`)),
      catchError(this.handleError)
    );
  }

  getReservationById(id: number): Observable<TransportReservationDTO> {
    return this.http.get<TransportReservationDTO>(`${this.reservationsUrl}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(reservation => console.log(`Réservation récupérée (id=${reservation.id})`)),
      catchError(this.handleError)
    );
  }

  createReservation(reservation: Partial<TransportReservationDTO>): Observable<TransportReservationDTO> {
    return this.http.post<TransportReservationDTO>(this.reservationsUrl, reservation, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(r => console.log(`Réservation créée (id=${r.id}, ticket=${r.ticketNumber})`)),
      catchError(this.handleError)
    );
  }

  // Méthode simplifiée pour réservation rapide utilisateur
  reserveTransport(userId: number, transportId: number): Observable<TransportReservationDTO> {
    const userName = localStorage.getItem('userName') || 'Utilisateur';
    const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
    
    const reservationData = {
      userId: userId,
      userName: userName,
      userEmail: userEmail,
      transportId: transportId,
      seatNumber: `AUTO-${Math.floor(Math.random() * 1000)}`,
      reservationDate: new Date().toISOString(),
      paymentStatus: 'PENDING' as const,
      ticketNumber: `WC2030-${Date.now()}`
    };

    return this.createReservation(reservationData);
  }

  updateReservation(id: number, reservation: Partial<TransportReservationDTO>): Observable<TransportReservationDTO> {
    return this.http.put<TransportReservationDTO>(`${this.reservationsUrl}/${id}`, reservation, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(r => console.log(`Réservation mise à jour (id=${r.id})`)),
      catchError(this.handleError)
    );
  }

  cancelReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.reservationsUrl}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => console.log(`Réservation annulée id=${id}`)),
      catchError(this.handleError)
    );
  }

  confirmPayment(reservationId: number, paymentData: any): Observable<TransportReservationDTO> {
    return this.http.post<TransportReservationDTO>(`${this.reservationsUrl}/${reservationId}/payment`, paymentData, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(r => console.log(`Paiement confirmé pour réservation ${r.id}`)),
      catchError(this.handleError)
    );
  }

  // ====== MÉTHODES UTILITAIRES ======

  getAvailableSeats(transportId: number): Observable<number> {
    return this.http.get<number>(`${this.transportsUrl}/${transportId}/available-seats`).pipe(
      catchError(this.handleError)
    );
  }

  checkSeatAvailability(transportId: number, seatNumber: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.transportsUrl}/${transportId}/seats/${seatNumber}/available`).pipe(
      catchError(this.handleError)
    );
  }

  generateTicketQR(reservationId: number): Observable<string> {
    return this.http.get<string>(`${this.reservationsUrl}/${reservationId}/qr-code`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // ====== STATISTIQUES ET RAPPORTS (pour admin) ======

  getTransportStats(): Observable<any> {
    return this.http.get<any>(`${this.transportsUrl}/stats`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  getReservationStats(): Observable<any> {
    return this.http.get<any>(`${this.reservationsUrl}/stats`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  getPopularRoutes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.transportsUrl}/popular-routes`).pipe(
      catchError(this.handleError)
    );
  }

  // ====== MÉTHODES WORLD CUP SPÉCIFIQUES ======

  getWorldCupTransports(): Observable<TransportDTO[]> {
    return this.http.get<TransportDTO[]>(`${this.transportsUrl}/world-cup`).pipe(
      tap(transports => console.log(`Transports World Cup: ${transports.length}`)),
      catchError(this.handleError)
    );
  }

  getTransportsByStadium(stadium: string): Observable<TransportDTO[]> {
    return this.http.get<TransportDTO[]>(`${this.transportsUrl}/stadium/${encodeURIComponent(stadium)}`).pipe(
      catchError(this.handleError)
    );
  }

  getMatchDayTransports(matchDay: string): Observable<TransportDTO[]> {
    return this.http.get<TransportDTO[]>(`${this.transportsUrl}/match-day/${matchDay}`).pipe(
      catchError(this.handleError)
    );
  }
}