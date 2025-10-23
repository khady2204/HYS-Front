import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  private readonly IdKey = 'ID';
  private readonly tokenKey = 'jwtToken';
  private readonly userKey = 'userInfo';

  // Observable pour suivre le user en temps réel
  private userSubject = new BehaviorSubject<any>(this.getUser());
  user$ = this.userSubject.asObservable();

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setUser(payload: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(payload));
    this.userSubject.next(payload); // Notifie les abonnés (profil, navbar, etc.)
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
    this.userSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
