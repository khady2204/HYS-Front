import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
    private authService: UserAuthService
  ) {}

  canActivate(): boolean {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      return true;
      // Utilisateur connecté → accès autorisé
    }else{
      // Non connecté → redirection vers login
      this.router.navigate(['/login']);
      return false;
    }
  }
}