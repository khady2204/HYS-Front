import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

   private ApiUrl = 'http://localhost:8081/api/auth';

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any>{
    return this.http.post(`${this.ApiUrl}/register`, data);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.ApiUrl}/login`, credentials);
  }
  
  /**
   * Envoie un code OTP pour connexion par OTP
   * @param data Données contenant l'email ou le numéro
   * @returns Observable avec l'OTP (en test)
   */
  sendOtp(data: any): Observable<any> {
    return this.http.post(`${this.ApiUrl}/send-otp`, data);
  }

  /**
   * Vérifie le code OTP et retourne un token
   * @param data Données contenant le code OTP
   * @returns Observable avec le token JWT
   */
  verifyOtp(data: any): Observable<any> {
    return this.http.post(`${this.ApiUrl}/verify-otp`, data);
  }

  /**
   * Envoie un OTP pour réinitialisation de mot de passe
   * @param data Données de l'utilisateur (email ou téléphone)
   * @returns Observable avec le code OTP (test)
   */
  reset(data: any): Observable<any> {
    return this.http.post(`${this.ApiUrl}/reset`, data);
  }

  /**
   * Confirme la réinitialisation avec OTP + nouveau mot de passe
   * @param data Données avec OTP et nouveau mot de passe
   * @returns Observable de confirmation
   */
  confirmReset(data: any): Observable<any> {
    return this.http.post(`${this.ApiUrl}/reset/confirm`, data);
  }
}
