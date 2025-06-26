import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { StorageService } from './storage.service';

export interface User {
  id: string;
  email: string;
  fullName: string;
  profileRank: string;
  profileScore: number;
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private readonly API_URL = 'https://aiavatarfinincail-be.onrender.com/api/v1';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.getToken();
    const user = this.getStoredUser();
    
    if (token && user) {
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(credentials: LoginCredentials): Observable<{ user: User; token: string }> {
    // For MVP, we'll simulate authentication with stored KYC data
    const kycData = this.storageService.getItem('kycData');
    
    if (kycData && kycData.email === credentials.email) {
      const user: User = {
        id: kycData.id || 'user_' + Date.now(),
        email: kycData.email,
        fullName: kycData.fullName,
        profileRank: kycData.profileRank || 'beginner',
        profileScore: kycData.profileScore || 0,
        createdAt: new Date(kycData.createdAt || Date.now())
      };

      const token = this.generateMockToken(user);
      
      this.setToken(token);
      this.setStoredUser(user);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);

      return of({ user, token });
    }

    // If no KYC data found, return error
    throw new Error('User not found. Please complete KYC first.');
  }

  register(data: RegisterData): Observable<{ user: User; token: string }> {
    // For MVP, we'll create a user without password (using KYC data)
    const user: User = {
      id: 'user_' + Date.now(),
      email: data.email,
      fullName: data.fullName,
      profileRank: 'beginner',
      profileScore: 0,
      createdAt: new Date()
    };

    const token = this.generateMockToken(user);
    
    this.setToken(token);
    this.setStoredUser(user);
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);

    return of({ user, token });
  }

  logout(): void {
    this.storageService.removeItem(this.TOKEN_KEY);
    this.storageService.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Token management
  private getToken(): string | null {
    return this.storageService.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    this.storageService.setItem(this.TOKEN_KEY, token);
  }

  private getStoredUser(): User | null {
    return this.storageService.getItem(this.USER_KEY);
  }

  private setStoredUser(user: User): void {
    this.storageService.setItem(this.USER_KEY, user);
  }

  // Mock token generation for MVP
  private generateMockToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.fullName,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    };
    
    // Simple base64 encoding for MVP (not secure for production)
    return btoa(JSON.stringify(payload));
  }

  // Token validation
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch {
      return false;
    }
  }

  // Password reset (for future implementation)
  requestPasswordReset(email: string): Observable<any> {
    // Mock implementation for MVP
    return of({ message: 'Password reset email sent' });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    // Mock implementation for MVP
    return of({ message: 'Password reset successful' });
  }

  // Profile update
  updateProfile(updates: Partial<User>): Observable<User> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('No user logged in');
    }

    const updatedUser = { ...currentUser, ...updates };
    this.setStoredUser(updatedUser);
    this.currentUserSubject.next(updatedUser);

    return of(updatedUser);
  }

  // Secure storage for sensitive data
  encryptAndStore(key: string, data: any): void {
    // For MVP, we'll use simple base64 encoding
    // In production, use proper encryption
    const encrypted = btoa(JSON.stringify(data));
    this.storageService.setItem(key, encrypted);
  }

  decryptAndRetrieve(key: string): any {
    const encrypted = this.storageService.getItem(key);
    if (!encrypted) return null;

    try {
      return JSON.parse(atob(encrypted));
    } catch {
      return null;
    }
  }
} 