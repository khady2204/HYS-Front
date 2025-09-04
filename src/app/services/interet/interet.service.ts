import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InteretService {

  private baseUrl = environment.apiBase + '/api';
  /*private baseUrl = 'http://localhost:8081/api';*/

  constructor(private http: HttpClient) { }

  // Récupérer la liste des intérêts
  getAllInterets(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/interets/listeinterets`);
} 


  /* Ajouter un nouvel intérêt
  createInteret(data: { userId: number, interets: number[] }) {
    return this.http.post(`${this.baseUrl}/interets`, data);
  } */

  createUserInteret(data: { userId: number, interetIds: number[] }): Observable<any> {
    return this.http.post(`${this.baseUrl}/interets/user`, data, { responseType: 'text' });
  }

  getCurrentUserInterets(): Observable<any[]> {
    const token = localStorage.getItem('jwtToken');
    const headers = { Authorization : `Bearer ${token}` };
    return this.http.get<any[]>(`${this.baseUrl}/interets/user/actuel`, { headers });
  }
}
