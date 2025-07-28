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

export interface AuthUser {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
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
    console.log('💾 Saving token to localStorage');
    localStorage.setItem('access_token', token);
    
    // Debug immédiat du token sauvegardé
    try {
      const decoded = this.jwtHelper.decodeToken(token);
      console.log('✅ Token decoded and saved successfully');
      console.log('📋 Token content:', decoded);
      
      // Vérifier immédiatement l'extraction de l'utilisateur
      const user = this.getAuthenticatedUser();
      console.log('👤 User extracted after save:', user);
    } catch (e) {
      console.error('❌ Error decoding token while saving:', e);
    }
  }

  logout(): void {
    console.log('👋 Logging out - removing token from localStorage');
    localStorage.removeItem('access_token');
  }

  getToken(): string | null {
    const token = localStorage.getItem('access_token');
    return token;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    
    if (!token) {
      return false;
    }
    
    const isExpired = this.jwtHelper.isTokenExpired(token);
    
    if (isExpired) {
      console.log('⏰ Token expired - removing from storage');
      this.logout();
      return false;
    }
    
    return true;
  }

  getAuthenticatedUser(): AuthUser | null {
    const token = this.getToken();
    
    if (!token) {
      console.log('❌ No token available for user extraction');
      return null;
    }
    
    try {
      const decoded = this.jwtHelper.decodeToken(token);
      console.log('🔍 Decoding token for user extraction:', decoded);
      console.log('🔍 All available claims:', Object.keys(decoded));
      
      // ✅ EXTRACTION DE L'ID UTILISATEUR - MÉTHODE CORRIGÉE
      let userId: number | null = null;
      
      // Méthode 1 : Subject (maintenant c'est l'ID utilisateur selon le backend corrigé)
      if (decoded.sub) {
        console.log('🔍 Subject found:', decoded.sub, typeof decoded.sub);
        try {
          const subAsNumber = Number(decoded.sub);
          if (!isNaN(subAsNumber) && subAsNumber > 0) {
            userId = subAsNumber;
            console.log('✅ User ID extracted from subject:', userId);
          }
        } catch (e) {
          console.warn('⚠️ Could not parse subject as number:', decoded.sub);
        }
      }
      
      // Méthode 2 : Claims userId
      if (!userId && decoded.userId !== undefined) {
        console.log('🔍 userId claim found:', decoded.userId, typeof decoded.userId);
        try {
          const userIdNumber = Number(decoded.userId);
          if (!isNaN(userIdNumber) && userIdNumber > 0) {
            userId = userIdNumber;
            console.log('✅ User ID extracted from userId claim:', userId);
          }
        } catch (e) {
          console.warn('⚠️ Could not parse userId claim as number:', decoded.userId);
        }
      }
      
      // Méthode 3 : Claims id
      if (!userId && decoded.id !== undefined) {
        console.log('🔍 id claim found:', decoded.id, typeof decoded.id);
        try {
          const idNumber = Number(decoded.id);
          if (!isNaN(idNumber) && idNumber > 0) {
            userId = idNumber;
            console.log('✅ User ID extracted from id claim:', userId);
          }
        } catch (e) {
          console.warn('⚠️ Could not parse id claim as number:', decoded.id);
        }
      }
      
      // ✅ EXTRACTION DE L'EMAIL - MÉTHODE CORRIGÉE
      let userEmail: string | null = null;
      
      // Vérifier le claim email
      if (decoded.email && typeof decoded.email === 'string' && decoded.email.includes('@')) {
        userEmail = decoded.email;
        console.log('✅ Email extracted from email claim:', userEmail);
      }
      
      // Si pas d'email dans les claims et subject ressemble à un email
      if (!userEmail && decoded.sub && typeof decoded.sub === 'string' && decoded.sub.includes('@')) {
        userEmail = decoded.sub;
        console.log('✅ Email extracted from subject:', userEmail);
      }
      
      // ✅ VALIDATION FINALE
      if (!userId || userId <= 0) {
        console.error('❌ CRITICAL: No valid user ID found in token!');
        console.error('🔍 Token claims available:', Object.keys(decoded));
        console.error('🔍 Token content:', decoded);
        
        // Essayer de forcer l'extraction avec d'autres méthodes
        for (const key of Object.keys(decoded)) {
          const value = decoded[key];
          if (typeof value === 'number' && value > 0 && value < 10000) {
            console.log(`🔍 Found potential user ID in claim '${key}':`, value);
            userId = value;
            break;
          }
        }
        
        if (!userId) {
          console.error('❌ IMPOSSIBLE TO EXTRACT USER ID - TOKEN MAY BE CORRUPTED');
          return null;
        }
      }
      
      if (!userEmail) {
        console.warn('⚠️ No email found in token, using fallback');
        userEmail = 'unknown@email.com';
      }
      
      const user: AuthUser = {
        id: userId,
        email: userEmail,
        firstName: decoded.firstName || decoded.first_name || decoded.given_name || '',
        lastName: decoded.lastName || decoded.last_name || decoded.family_name || ''
      };
      
      console.log('✅ User successfully extracted:', user);
      return user;
      
    } catch (e) {
      console.error('❌ Error decoding token:', e);
      this.logout();
      return null;
    }
  }

  debugToken(): void {
    const token = this.getToken();
    if (!token) {
      console.log('❌ No token to debug');
      return;
    }

    console.log('=== 🔍 TOKEN DEBUG START ===');
    console.log('📄 Raw token (first 50 chars):', token.substring(0, 50) + '...');
    
    try {
      const decoded = this.jwtHelper.decodeToken(token);
      console.log('📋 Decoded payload:', decoded);
      
      console.log('📝 All token fields:');
      Object.entries(decoded).forEach(([key, value]) => {
        console.log(`  ${key}: ${value} (${typeof value})`);
      });
      
      console.log('⏰ Token expired:', this.jwtHelper.isTokenExpired(token));
      console.log('📅 Expiration date:', this.jwtHelper.getTokenExpirationDate(token));
      
      // Test de l'extraction utilisateur
      const user = this.getAuthenticatedUser();
      console.log('👤 Extracted user:', user);
      
    } catch (e) {
      console.error('❌ Error debugging token:', e);
    }
    
    console.log('=== 🔚 TOKEN DEBUG END ===');
  }

  refreshUserInfo(): AuthUser | null {
    console.log('🔄 Refreshing user info...');
    
    if (!this.isAuthenticated()) {
      console.log('❌ User no longer authenticated');
      return null;
    }
    
    return this.getAuthenticatedUser();
  }
  
  forceTokenReload(): AuthUser | null {
    console.log('🔄 Force reloading token data...');
    
    // Forcer un nouveau décodage du token
    const token = this.getToken();
    if (!token) {
      console.log('❌ No token to reload');
      return null;
    }
    
    try {
      // Décoder à nouveau le token et retourner l'utilisateur
      const decoded = this.jwtHelper.decodeToken(token);
      console.log('🔄 Force decoding token:', decoded);
      
      return this.getAuthenticatedUser();
    } catch (e) {
      console.error('❌ Error force reloading token:', e);
      return null;
    }
  }

  // ✅ NOUVELLE MÉTHODE : Test complet du token
  performCompleteTokenTest(): void {
    console.log('=== 🧪 COMPLETE TOKEN TEST START ===');
    
    const token = this.getToken();
    if (!token) {
      console.log('❌ No token found for testing');
      return;
    }
    
    console.log('1. Raw token length:', token.length);
    console.log('2. Token parts (should be 3):', token.split('.').length);
    
    try {
      // Test de décodage brut avec jwt-helper
      const rawDecoded = this.jwtHelper.decodeToken(token);
      console.log('3. Raw decoded token:', rawDecoded);
      
      // Test d'expiration
      const isExpired = this.jwtHelper.isTokenExpired(token);
      console.log('4. Is token expired:', isExpired);
      
      // Test d'extraction utilisateur
      const user = this.getAuthenticatedUser();
      console.log('5. Extracted user:', user);
      
      // Test de validation
      const isAuth = this.isAuthenticated();
      console.log('6. Is authenticated:', isAuth);
      
    } catch (e) {
      console.error('❌ Token test failed:', e);
    }
    
    console.log('=== 🧪 COMPLETE TOKEN TEST END ===');
  }
}