import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface updateProfileRequest {
  id: number;
 // nom: string;
  prenom: string;
  email: string;
  phone?: string;
  adresse?: string;
  bio?: string;
  profileImage?: string;
  //interetIds?: number[];
  dateNaissance: number;
  pays: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8081/api/user';

  constructor(private http: HttpClient) { }

  // Mise à jour du profil utilisateur
  updateProfile(data: updateProfileRequest): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/update-profile`, data);
  }

  
}
