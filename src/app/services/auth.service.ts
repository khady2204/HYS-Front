import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GoogleLoginRequest, AuthResponse } from '../models/auth.dto';
import { UserAuthService } from './user-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public ApiUrl = environment.apiBase ;

  constructor(private http: HttpClient, private userAuth: UserAuthService) {}

  register(data: any): Observable<any>{
    return this.http.post(`${this.ApiUrl}/api/auth/register`, data);
  }

  login(credentials: { email: string; phone: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.ApiUrl}/api/auth/login`, credentials).pipe(
      tap((res: any) => {
        if (res?.token) this.userAuth.setToken(res.token);
        if (res?.user) {
          this.userAuth.setUser(res.user);
          this.userAuth.setId(res.user.id?.toString() ?? '');
        }
      })
    );
  }

  /**
   * Envoie un code OTP pour connexion par OTP
   * @param data Données contenant l'email ou le numéro
   * @returns Observable avec l'OTP (en test)
   */
  sendOtp(data: any): Observable<any> {
    return this.http.post(`${this.ApiUrl}/api/auth/send-otp`, data);
  }

  /**
   * Vérifie le code OTP et retourne un token
   * @param data Données contenant le code OTP
   * @returns Observable avec le token JWT
   */
  verifyOtp(data: any): Observable<any> {
    return this.http.post(`${this.ApiUrl}/api/auth/verify-otp`, data);
  }

  //Envoie un OTP pour réinitialisation de mot de passe
  // Étape 1 : Envoi OTP
  requestReset(data: any): Observable<any> {
    return this.http.post(`${this.ApiUrl}/api/auth/reset/request`, data, { responseType: 'text' });
  }

  // Étape 2 : Vérification OTP
  verifyOtpForReset(data:{ phone: string; otp: string } ): Observable<any> {
    return this.http.post(`${this.ApiUrl}/api/auth/reset/verify-otp`, data, { responseType: 'text' });
  }

  // Étape 3 : Changement de mot de passe
  confirmReset(data: any): Observable<any> {
    return this.http.post(`${this.ApiUrl}/api/auth/reset/password`, data,{ responseType: 'text' } );
  }

  // logout
  logout(): Observable<any> {
    return this.http.post(`${this.ApiUrl}/api/auth/logout`, {}, { responseType: 'text' }).pipe(
      tap(() => {
        this.userAuth.clear();
      })
    );
  }

  /**
   * Authentification via Google OAuth
   * @param data Objet contenant l'idToken Google
   * @returns Observable avec le token JWT ou message d'erreur
   */
  googleLogin(data: GoogleLoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.ApiUrl}/api/auth/google-login`, data);
  }
}
