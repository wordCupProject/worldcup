import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  createReservation(reservation: HotelReservationDTO): Observable<HotelReservationDTO> {
    return this.http.post<HotelReservationDTO>(this.apiUrl, reservation);
  }

  getUserReservations(userId: number): Observable<HotelReservationDTO[]> {
    return this.http.get<HotelReservationDTO[]>(`${this.apiUrl}/user/${userId}`);
  }

  getAllReservations(): Observable<HotelReservationDTO[]> {
    return this.http.get<HotelReservationDTO[]>(this.apiUrl);
  }

  getReservationById(id: number): Observable<HotelReservationDTO> {
    return this.http.get<HotelReservationDTO>(`${this.apiUrl}/${id}`);
  }

  cancelReservation(id: number): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/${id}/cancel`, {});
  }

  updateReservationStatus(id: number, status: string): Observable<HotelReservationDTO> {
    return this.http.put<HotelReservationDTO>(`${this.apiUrl}/${id}/status`, null, {
      params: { status }
    });
  }

  deleteReservation(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`);
  }
}