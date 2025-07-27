// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

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
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  register(payload: RegisterPayload): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/register`, payload);
  }

  login(payload: LoginPayload): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/login`, payload);
  }

  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  logout(): void {
    localStorage.removeItem('access_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  getAuthenticatedUser(): { email: string; id: number } | null {
    const token = this.getToken();
    if (token) {
      try {
        const decoded = this.jwtHelper.decodeToken(token);
        console.log('Decoded token:', decoded); // Utile pour déboguer
        return {
          email: decoded.sub || decoded.email,
          id: decoded.id || decoded.userId // Adapte selon ton backend
        };
      } catch (e) {
        console.error('Erreur lors du décodage du token :', e);
        return null;
      }
    }
    return null;
  }
}
