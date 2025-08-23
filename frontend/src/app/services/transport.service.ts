// transport.service.ts - Version corrigée avec JWT fix
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

  // ✅ CORRECTION CRITIQUE - Headers avec authentification
  private getAuthHeaders(): HttpHeaders {
    // ✅ Utiliser la même clé que dans auth.service.ts
    const token = localStorage.getItem('access_token'); // ⚠️ ÉTAIT 'token' maintenant 'access_token'
    
    console.log('🔍 Getting auth headers...');
    console.log('📄 Token found:', token ? 'YES' : 'NO');
    
    if (token) {
      console.log('📄 Token preview:', token.substring(0, 50) + '...');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      console.log('✅ Adding Authorization header');
      return headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.log('⚠️ No token - sending request without authorization');
      return headers;
    }
  }

  // ✅ Méthode de test pour vérifier les headers
  testAuthHeaders(): void {
    console.log('=== 🧪 TESTING AUTH HEADERS ===');
    const headers = this.getAuthHeaders();
    const authHeader = headers.get('Authorization');
    
    console.log('Headers created:', {
      'Content-Type': headers.get('Content-Type'),
      'Authorization': authHeader ? authHeader.substring(0, 20) + '...' : 'NONE'
    });
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      console.log('✅ Authorization header correctly formatted');
    } else {
      console.log('❌ Authorization header missing or malformed');
    }
    console.log('=== 🧪 TEST END ===');
  }

  // Gestion des erreurs améliorée
  private handleError(error: any) {
    console.error('🚨 Transport Service Error:', error);
    
    // Log détaillé pour debug JWT
    if (error.status === 401) {
      console.error('❌ 401 Unauthorized - Problème d\'authentification JWT');
      console.error('🔍 Current token:', localStorage.getItem('access_token') ? 'PRESENT' : 'MISSING');
      this.testAuthHeaders(); // Debug automatique
    }
    
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.status === 0) {
      errorMessage = 'Impossible de contacter le serveur';
    } else if (error.status === 401) {
      errorMessage = 'Non autorisé - veuillez vous reconnecter';
    } else if (error.status === 403) {
      errorMessage = 'Accès refusé - permissions insuffisantes';
    } else if (error.status === 404) {
      errorMessage = 'Ressource non trouvée';
    } else if (error.status >= 500) {
      errorMessage = 'Erreur du serveur';
    }
    
    return throwError(() => new Error(errorMessage));
  }

  // ====== MÉTHODES TRANSPORTS ======

  getAllTransports(): Observable<TransportDTO[]> {
    console.log('📋 Fetching all transports...');
    return this.http.get<TransportDTO[]>(this.transportsUrl).pipe(
      tap(transports => console.log(`✅ Transports chargés: ${transports.length}`)),
      catchError(this.handleError)
    );
  }

  getTransportById(id: number): Observable<TransportDTO> {
    console.log(`🔍 Fetching transport by ID: ${id}`);
    return this.http.get<TransportDTO>(`${this.transportsUrl}/${id}`).pipe(
      tap(transport => console.log(`✅ Transport récupéré (id=${transport.id})`)),
      catchError(this.handleError)
    );
  }

  addTransport(transport: TransportDTO): Observable<TransportDTO> {
    console.log('➕ Adding new transport...');
    console.log('📤 Transport data:', transport);
    
    // ✅ Test des headers avant envoi
    this.testAuthHeaders();
    
    return this.http.post<TransportDTO>(this.transportsUrl, transport, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(t => console.log(`✅ Transport ajouté (id=${t.id})`)),
      catchError(error => {
        console.error('❌ Error adding transport:', error);
        return this.handleError(error);
      })
    );
  }

  updateTransport(id: number, transport: Partial<TransportDTO>): Observable<TransportDTO> {
    console.log(`✏️ Updating transport ID: ${id}`);
    
    return this.http.put<TransportDTO>(`${this.transportsUrl}/${id}`, transport, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(t => console.log(`✅ Transport mis à jour (id=${t.id})`)),
      catchError(this.handleError)
    );
  }

  deleteTransport(id: number): Observable<void> {
    console.log(`🗑️ Deleting transport ID: ${id}`);
    
    return this.http.delete<void>(`${this.transportsUrl}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => console.log(`✅ Transport supprimé id=${id}`)),
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
    console.log('🔍 Searching transports with params:', params);
    
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    return this.http.get<TransportDTO[]>(`${this.transportsUrl}/search?${searchParams}`).pipe(
      tap(results => console.log(`✅ Résultats recherche: ${results.length}`)),
      catchError(this.handleError)
    );
  }

  // ====== MÉTHODES RÉSERVATIONS ======

  getAllReservations(): Observable<TransportReservationDTO[]> {
    console.log('📋 Fetching all reservations...');
    
    return this.http.get<TransportReservationDTO[]>(this.reservationsUrl, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(reservations => console.log(`✅ Réservations chargées: ${reservations.length}`)),
      catchError(this.handleError)
    );
  }

  getUserReservations(userId: number): Observable<TransportReservationDTO[]> {
    console.log(`👤 Fetching reservations for user: ${userId}`);
    
    return this.http.get<TransportReservationDTO[]>(`${this.reservationsUrl}/user/${userId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(reservations => console.log(`✅ Réservations utilisateur ${userId}: ${reservations.length}`)),
      catchError(this.handleError)
    );
  }

  getReservationById(id: number): Observable<TransportReservationDTO> {
    console.log(`🔍 Fetching reservation by ID: ${id}`);
    
    return this.http.get<TransportReservationDTO>(`${this.reservationsUrl}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(reservation => console.log(`✅ Réservation récupérée (id=${reservation.id})`)),
      catchError(this.handleError)
    );
  }

  createReservation(reservation: Partial<TransportReservationDTO>): Observable<TransportReservationDTO> {
    console.log('➕ Creating new reservation...');
    console.log('📤 Reservation data:', reservation);
    
    return this.http.post<TransportReservationDTO>(this.reservationsUrl, reservation, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(r => console.log(`✅ Réservation créée (id=${r.id}, ticket=${r.ticketNumber})`)),
      catchError(this.handleError)
    );
  }

  // ✅ Méthode améliorée pour réservation rapide utilisateur
  reserveTransport(userId: number, transportId: number): Observable<TransportReservationDTO> {
    console.log(`🎫 Creating reservation for user ${userId}, transport ${transportId}`);
    
    // ✅ Utiliser les mêmes clés que auth.service.ts
    const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
    const userName = `User-${userId}`; // Fallback si pas de nom
    
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

    console.log('📤 Reservation data:', reservationData);
    
    return this.createReservation(reservationData);
  }

  updateReservation(id: number, reservation: Partial<TransportReservationDTO>): Observable<TransportReservationDTO> {
    console.log(`✏️ Updating reservation ID: ${id}`);
    
    return this.http.put<TransportReservationDTO>(`${this.reservationsUrl}/${id}`, reservation, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(r => console.log(`✅ Réservation mise à jour (id=${r.id})`)),
      catchError(this.handleError)
    );
  }

  cancelReservation(id: number): Observable<void> {
    console.log(`❌ Canceling reservation ID: ${id}`);
    
    return this.http.delete<void>(`${this.reservationsUrl}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => console.log(`✅ Réservation annulée id=${id}`)),
      catchError(this.handleError)
    );
  }

  confirmPayment(reservationId: number, paymentData: any): Observable<TransportReservationDTO> {
    console.log(`💳 Confirming payment for reservation: ${reservationId}`);
    
    return this.http.post<TransportReservationDTO>(`${this.reservationsUrl}/${reservationId}/payment`, paymentData, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(r => console.log(`✅ Paiement confirmé pour réservation ${r.id}`)),
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
      tap(transports => console.log(`✅ Transports World Cup: ${transports.length}`)),
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

  // ✅ NOUVELLE MÉTHODE - Test de connectivité complète
  testFullConnection(): Observable<any> {
    console.log('🧪 Testing full connection with backend...');
    
    // Test simple sans auth
    return this.http.get(`${this.apiUrl}/test`).pipe(
      tap(response => {
        console.log('✅ Backend connection successful:', response);
        
        // Si connexion OK, tester avec auth
        this.testAuthConnection();
      }),
      catchError(error => {
        console.error('❌ Backend connection failed:', error);
        return throwError(() => error);
      })
    );
  }

  // Test avec authentification
  private testAuthConnection(): void {
    console.log('🔐 Testing authenticated connection...');
    
    this.getAllTransports().subscribe({
      next: (transports) => {
        console.log('✅ Authenticated request successful, got transports:', transports.length);
      },
      error: (error) => {
        console.error('❌ Authenticated request failed:', error);
        console.error('🔍 This suggests JWT token issues');
      }
    });
  }
}