import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  private readonly IdKey = 'ID';
  private readonly tokenKey = 'jwtToken';
  private readonly userKey = 'userInfo';

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setUser(payload: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(payload));
  }

  getUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  getUserId(): number | null {
    const user = this.getUser();
    return user ? user.id : null;
  }

  getEmail(): string | null {
    const user = this.getUser();
    return user ? user.email : null;
  }

  getFullName(): string | null {
    const user = this.getUser();
    return user ? `${user.prenom} ${user.nom}` : null;
  }


  setId(ID: string): void {
    localStorage.setItem(this.IdKey, ID);
  }

  getId(): string | null {
    return localStorage.getItem(this.IdKey);
  }

  clear(): void {
    localStorage.clear();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  
}
