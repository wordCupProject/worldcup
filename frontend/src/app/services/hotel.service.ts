import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HotelDTO {
  name: string;
  city: string;
  stars: number;
  address: string;
  description?: string;
  services: string[];
}

@Injectable({ providedIn: 'root' })
export class HotelService {
  private apiUrl = 'http://localhost:8081/api/hotels'; // Met à jour selon ton backend

  constructor(private http: HttpClient) {}

  addHotel(hotel: HotelDTO | FormData): Observable<any> {
    if (hotel instanceof FormData) {
      // multipart/form-data avec photo
      return this.http.post(this.apiUrl, hotel);
    } else {
      // JSON classique
      return this.http.post(this.apiUrl, hotel, {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}
