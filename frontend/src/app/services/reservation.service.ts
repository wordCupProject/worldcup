// src/app/services/reservation.service.ts
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

export interface HotelReservation {
  id: number;
  hotel: string;
  date: string;
  rooms: number;
  status: 'Confirmé' | 'En attente';
}

export interface TransportReservation {
  id: number;
  type: string;
  from: string;
  to: string;
  date: string;
  passengers: number;
  status: 'Confirmé' | 'En attente';
}

export interface Event {
  id: number;
  title: string;
  location: string;
  time: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private hotelReservations: HotelReservation[] = [
    { id: 1, hotel: 'Hôtel Marrakech Plaza', date: '14-28 juin 2030', rooms: 25, status: 'Confirmé' },
    { id: 2, hotel: 'Casablanca Royal', date: '15-30 juin 2030', rooms: 40, status: 'En attente' },
    { id: 3, hotel: 'Rabat Suites', date: '10-25 juin 2030', rooms: 15, status: 'Confirmé' }
  ];

  private transportReservations: TransportReservation[] = [
    { id: 1, type: 'Bus', from: 'Aéroport Marrakech', to: 'Hôtel Marrakech Plaza', date: '14 juin 2030', passengers: 25, status: 'Confirmé' },
    { id: 2, type: 'Train', from: 'Casablanca', to: 'Marrakech', date: '15 juin 2030', passengers: 40, status: 'En attente' }
  ];

  private upcomingEvents: Event[] = [
    { id: 1, title: 'Cérémonie d\'ouverture', location: 'Stade de Marrakech', time: '18:00', date: '14 juin 2030' },
    { id: 2, title: 'Match d\'ouverture', location: 'Stade Mohammed V, Casablanca', time: '20:00', date: '15 juin 2030' },
    { id: 3, title: 'Match Maroc vs Brésil', location: 'Stade Adrar, Agadir', time: '18:00', date: '20 juin 2030' }
  ];

  constructor() { }

  getHotelReservations(): Observable<HotelReservation[]> {
    return of(this.hotelReservations);
  }

  getTransportReservations(): Observable<TransportReservation[]> {
    return of(this.transportReservations);
  }

  getUpcomingEvents(): Observable<Event[]> {
    return of(this.upcomingEvents);
  }

  cancelHotelReservation(id: number): Observable<boolean> {
    this.hotelReservations = this.hotelReservations.filter(r => r.id !== id);
    return of(true);
  }

  cancelTransportReservation(id: number): Observable<boolean> {
    this.transportReservations = this.transportReservations.filter(r => r.id !== id);
    return of(true);
  }

  addHotelReservation(reservation: HotelReservation): Observable<HotelReservation> {
    reservation.id = this.hotelReservations.length + 1;
    this.hotelReservations.push(reservation);
    return of(reservation);
  }

  addTransportReservation(reservation: TransportReservation): Observable<TransportReservation> {
    reservation.id = this.transportReservations.length + 1;
    this.transportReservations.push(reservation);
    return of(reservation);
  }
}