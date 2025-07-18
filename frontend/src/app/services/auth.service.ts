// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegisterPayload {
  firstName: string;
  lastName:  string;
  email:     string;
  phone:     string;
  country:   string;
  password:  string;
}

export interface LoginPayload {
  email:    string;
  password: string;
}

export interface ApiResponse {
  message?: string;
  token?:   string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8081/api/auth';

  constructor(private http: HttpClient) {}

  // Enregistrement
  register(payload: RegisterPayload): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/register`, payload);
  }

  // Connexion
  login(payload: LoginPayload): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/login`, payload);
  }

  // Sauvegarder token JWT dans localStorage
  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  // Supprimer token à la déconnexion
  logout(): void {
    localStorage.removeItem('access_token');
  }

  // Récupérer le token JWT
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Extraire l'email depuis le token JWT
  getAuthenticatedUser(): { email: string } | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return { email: payload.sub || payload.email };
    } catch (error) {
      console.error('Erreur lors du décodage du token :', error);
      return null;
    }
  }
}
