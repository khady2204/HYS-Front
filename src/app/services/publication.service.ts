import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserAuthService } from './user-auth.service';

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages?: number;
  size?: number;
  number?: number;
}

export interface Publication {
  id: number;
  mediaType: string;
  mediaUrl: string;
  texte: string;
  auteurNom: string;
  createdAt: string;
  nombreLikes : number;
  nombreCommentaires: number;  
  nombrePartages: number;
  commentaires?: any[];
  
  
  user: {
    id: number;
    profileImage?: string;
  };

}

@Injectable({
  providedIn: 'root'
})
export class PublicationService {
   
  
  private apiUrl = environment.apiBase;

  constructor(private http: HttpClient,
    private userAuthService : UserAuthService
  ) {}

  posterPublication(texte: string, mediaFile? : Blob) : Observable<any> {
    const formData = new FormData();
    formData.append('texte', texte);
    if (mediaFile) {
      formData.append('media', mediaFile, 'media.jpg'); // nom du fichier à adapter (photo.jpg, video.mp4, etc.)
    }
    return this.http.post(`${this.apiUrl}/publications/poster`, formData);
  }
  
  getPublications(page: number= 0): Observable<Page<Publication>> {
    return this.http.get<Page<Publication>>(`${this.apiUrl}/publications?page=${page}`);
  }

  
  toggleLike(pubId: number): Observable<any> {
    const token = this.userAuthService.getToken();
    return this.http.post<any>(`${this.apiUrl}/publications/${pubId}/like`, {},
    {
      headers: {
        Authorization: `Bearer ${token}` // envoie le token au backend
      },
       responseType: 'text' as 'json'
    } );
  }
  
  getCommentaires(pubId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/publications/${pubId}/commentaires`);
  }

  addCommentaire(pubId: number, contenu: string) {
    return this.http.post(`${this.apiUrl}/publications/${pubId}/commentaires`, { contenu });
  }
  
  toggleLikeCommentaire(commentId: number) {
  return this.http.post<any>(`${this.apiUrl}/commentaires/${commentId}/like`, {});
}

}
