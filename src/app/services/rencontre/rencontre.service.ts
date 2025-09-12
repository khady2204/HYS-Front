import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MediaItem {
  url: string;
  type: 'image' | 'video';
  description?: string;
}

export interface Commentaire {
  id: number;
  contenu: string;
  auteurNom: string;
  likesCount: number;
  dateCreation: string;
  auteurAvatar?: string;
}

export interface Publication {
  id: number;
  texte?: string;
  auteurNom: string;
  nombreCommentaires: number;
  nombreLikes: number;
  nombrePartages: number;
  medias: MediaItem[];
  dateCreation: string;
  auteurAvatar?: string;
  userId: number;
  liked?: boolean;
}

export interface PublicationResponse {
  content: Publication[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class RencontreService {
  private apiUrl = `${environment.apiBase}/publications`;

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: environment.withCredentials || false
    };
  }

  /**
   * Récupère la liste des publications
   */
  getPublications(page: number = 0, size: number = 10): Observable<PublicationResponse> {
    const params = { page: page.toString(), size: size.toString() };
    return this.http.get<PublicationResponse>(this.apiUrl, {
      ...this.getHttpOptions(),
      params
    });
  }

  /**
   * Récupère une publication spécifique par ID
   */
  getPublicationById(id: number): Observable<Publication> {
    return this.http.get<Publication>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  /**
   * Aime ou retire le like d'une publication
   */
  toggleLike(publicationId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${publicationId}/like`, {}, this.getHttpOptions());
  }

  /**
   * Partage une publication
   */
  partagerPublication(publicationId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${publicationId}/partage`, {}, this.getHttpOptions());
  }

  /**
   * Supprime une publication
   */
  supprimerPublication(publicationId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${publicationId}/supprimer`, this.getHttpOptions());
  }

  /**
   * Récupère les commentaires d'une publication
   */
  getCommentaires(publicationId: number): Observable<Commentaire[]> {
    return this.http.get<Commentaire[]>(`${this.apiUrl}/${publicationId}/commentaires`, this.getHttpOptions());
  }

  /**
   * Ajoute un commentaire à une publication
   */
  ajouterCommentaire(publicationId: number, contenu: string): Observable<Commentaire> {
    const body = { contenu };
    return this.http.post<Commentaire>(`${this.apiUrl}/${publicationId}/commentaires`, body, this.getHttpOptions());
  }

  /**
   * Like ou retire le like d'un commentaire
   */
  toggleLikeCommentaire(commentaireId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/commentaires/${commentaireId}/like`, {}, this.getHttpOptions());
  }
}
