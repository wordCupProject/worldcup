// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Assurez-vous que l'URL correspond à celle de votre backend
  private baseUrl = 'http://localhost:8081/api/users';

  constructor(private http: HttpClient) {}

  /** GET /api/users/email/{email} */
  getByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/email/${email}`);
  }
}
