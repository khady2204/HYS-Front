import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

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

}

@Injectable({
  providedIn: 'root'
})
export class PublicationService {
   
  
  private apiUrl = environment.apiBase;

  constructor(private http: HttpClient) {}

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

}
