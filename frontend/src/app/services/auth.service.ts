// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface pour l'inscription
export interface RegisterPayload {
  firstName: string;
  lastName:  string;
  email:     string;
  phone:     string;
  country:   string;
  password:  string;
}

// Interface pour la connexion
export interface LoginPayload {
  email:    string;
  password: string;
}

// Interface pour la réponse API (générique)
export interface ApiResponse {
  message?: string;
  token?:   string; // pour la réponse du login
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8081/api/auth'; // adapte selon ton port backend

  constructor(private http: HttpClient) {}

  // ✅ Enregistrement
  register(payload: RegisterPayload): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/register`, payload);
  }

  // ✅ Connexion
  login(payload: LoginPayload): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/login`, payload);
  }
}
