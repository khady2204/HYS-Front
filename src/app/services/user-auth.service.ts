import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  private readonly IdKey = 'Id';
  private readonly tokenKey = 'jwtToken';

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setId(Id: string): void {
    localStorage.setItem(this.IdKey, Id);
  }

  getId(): string | null {
    return localStorage.getItem(this.IdKey);
  }

  clear(): void {
    localStorage.clear();
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null && this.getId() !== null;
  }
}
