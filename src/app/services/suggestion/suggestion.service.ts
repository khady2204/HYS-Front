import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {

  private baseUrl = 'http://localhost:8081/api/suggestions';

  constructor(private http: HttpClient) { }

  // Récupérer la liste des suggestions
  getSuggestions(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
}
