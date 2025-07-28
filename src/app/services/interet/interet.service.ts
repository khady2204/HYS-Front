import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InteretService {

  private baseUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) { }

  // Récupérer la liste des intérêts
  getAllInterets(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/interets`);
} 


  // Ajouter un nouvel intérêt
  createInteret(data: { userId: number, interets: number[] }) {
    return this.http.post(`${this.baseUrl}/interets`, data);
  }
}
