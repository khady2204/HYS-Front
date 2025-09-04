import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SuggestionService {

  private baseUrl = environment.apiBase + '/api/suggestions';

  constructor(private http: HttpClient) { }

  // Récupérer la liste des suggestions
  getSuggestions(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
}
