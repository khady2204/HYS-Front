import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface updateProfileRequest {
  id: number;
 // nom: string;
  prenom: string;
  nom: string,
  email: string;
  phone?: string;
  adresse?: string;
  bio?: string;
  //interetIds?: number[];
  dateNaissance: number;
  pays: string;
  interetIds?: number[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8081/api/user';

  constructor(private http: HttpClient) { }

  // Mise à jour du profil utilisateur
  updateProfile(data: updateProfileRequest): Observable<string> {
    return this.http.put(`${this.baseUrl}/update-profile`, data, { responseType: 'text'});
  }

  /* updateProfile(formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-proile`, formData);
  } */

  // Récuperer le profil d'un utilisateur via son ID
  getProfile(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/profile/${id}`);
  }
}
