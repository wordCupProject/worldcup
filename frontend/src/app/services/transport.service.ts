import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransportDTO } from '../admin/pages/transports/transports.page';

@Injectable({
  providedIn: 'root'
})
export class TransportService {

  private baseUrl = 'http://localhost:8081/api/transports';

  constructor(private http: HttpClient) {}

  getAllTransports(): Observable<TransportDTO[]> {
    return this.http.get<TransportDTO[]>(this.baseUrl);
  }

  addTransport(transport: TransportDTO): Observable<TransportDTO> {
    return this.http.post<TransportDTO>(this.baseUrl, transport);
  }


  // ajoute d'autres méthodes si besoin (update, delete...)
reserveTransport(userId: number, transportId: number): Observable<any> {
  return this.http.post<any>(`http://localhost:8081/api/reservations`, {
    userId,
    transportId
  });
}

}
