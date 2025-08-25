import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private ApiUrl = 'http://192.168.1.64:8081/api/auth';


  constructor(private http: HttpClient) {}

  register(data: any): Observable<any>{
    return this.http.post(`${this.ApiUrl}/register`, data, { responseType: 'text' });
  }

  login(credentials: { email: string; phone: string; password: string }): Observable<any> {
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

  //Envoie un OTP pour réinitialisation de mot de passe
  // Étape 1 : Envoi OTP
  requestReset(data: any): Observable<any> {
    return this.http.post(`${this.ApiUrl}/reset/request`, data, { responseType: 'text' });
  }

  // Étape 2 : Vérification OTP
  verifyOtpForReset(data:{ phone: string; otp: string } ): Observable<any> {
    return this.http.post(`${this.ApiUrl}/reset/verify-otp`, data, { responseType: 'text' });
  }

  // Étape 3 : Changement de mot de passe
  confirmReset(data: any): Observable<any> {
    return this.http.post(`${this.ApiUrl}/reset/password`, data,{ responseType: 'text' } );
  }

  // logout
  logout(): Observable<any> {
    return this.http.post(`${this.ApiUrl}/logout`, {}).pipe(
      tap(() => {
        // Supprimer le token localement
        localStorage.removeItem('jwtToken');
      })
    );
  }
}
