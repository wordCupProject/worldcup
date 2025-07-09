import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({ providedIn: 'root' })
export class HotelService {
  private apiUrl = 'http://localhost:8081/api/hotels';

  constructor(private http: HttpClient) {}

  addHotel(hotel: HotelDTO | FormData): Observable<any> {
    if (hotel instanceof FormData) {
      return this.http.post(this.apiUrl, hotel);
    } else {
      return this.http.post(this.apiUrl, hotel, {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  getAllHotels(): Observable<HotelDTO[]> {
    return this.http.get<HotelDTO[]>(this.apiUrl);
  }

  getHotelById(id: number): Observable<HotelDTO> {
    return this.http.get<HotelDTO>(`${this.apiUrl}/${id}`);
  }

  updateHotel(id: number, hotel: HotelDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, hotel);
  }

  deleteHotel(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getImageUrl(filename: string): string {
    return `${this.apiUrl}/images/${filename}`;
  }
}