import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


export interface updateProfileRequest {
  id: number;
  prenom: string;
  nom: string,
  email: string;
  phone?: string;
  adresse?: string;
  bio?: string;
  dateNaissance: number;
  //pays: string;
  interetIds?: number[];
  profileImage: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.apiBase + '/api/user';

  constructor(private http: HttpClient) { }

  // Mise à jour du profil utilisateur
  updateProfile(formData: FormData): Observable<updateProfileRequest> {
    return this.http.put<updateProfileRequest>(`${this.baseUrl}/update-profile`, formData);
  }

  /* updateProfile(formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-proile`, formData);
  } */

  // Récuperer le profil d'un utilisateur via son ID
  getProfile(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/profile/${id}`);
  }
}
