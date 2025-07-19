import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InteretService {

  private baseUrl = 'http://localhost:8081/api/interets';

  constructor(private http: HttpClient) { }

  // Récupérer la liste des intérêts
  getAllInterets(): Observable<any> {
  return this.http.get<any>(this.baseUrl);
} 


  // Ajouter un nouvel intérêt
  createInteret(interet: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, interet);
  }
}
