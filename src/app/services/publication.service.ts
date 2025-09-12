import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface MediaItem {
  id?: string;
  url: string;
  type: 'image' | 'video';
  description?: string;
}

export interface Commentaire {
  id: number;
  contenu: string;
  auteurNom: string;
  auteurId: number;
  createdAt: string;
  likesCount: number;
  reponses: any[];
  liked?: boolean;
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

export interface CreatePublicationData {
  texte?: string;
  fichiers?: File[];
  descriptions?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

  private apiUrl = `${environment.apiBase}/publications`;

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'accept': 'application/json'
      }),
      withCredentials: environment.withCredentials || false
    };
  }

  private getMultipartHttpOptions() {
    return {
      withCredentials: environment.withCredentials || false
    };
  }

  /**
   * Crée une nouvelle publication avec texte et/ou médias
   */
  creerPublication(data: CreatePublicationData): Observable<Publication> {
    const formData = new FormData();

    // Ajouter le texte si présent
    if (data.texte && data.texte.trim()) {
      formData.append('texte', data.texte.trim());
    }

    // Ajouter les fichiers si présents
    if (data.fichiers && data.fichiers.length > 0) {
      data.fichiers.forEach((file, index) => {
        formData.append('fichiers', file);

        // Ajouter la description correspondante si elle existe
        if (data.descriptions && data.descriptions[index]) {
          formData.append('descriptions', data.descriptions[index]);
        }
      });
    }

    return this.http.post<Publication>(this.apiUrl, formData, this.getMultipartHttpOptions());
  }

  /**
   * Crée une publication texte seulement
   */
  creerPublicationTexte(texte: string): Observable<Publication> {
    return this.creerPublication({ texte });
  }

  /**
   * Crée une publication avec médias et texte optionnel
   */
  creerPublicationMedias(fichiers: File[], texte?: string, descriptions?: string[]): Observable<Publication> {
    return this.creerPublication({ texte, fichiers, descriptions });
  }

  /**
   * Récupère toutes les publications avec pagination
   */
  getPublications(page: number = 0, size: number = 10): Observable<PublicationResponse> {
    return this.http.get<PublicationResponse>(`${this.apiUrl}?page=${page}&size=${size}`, this.getHttpOptions());
  }

  /**
   * Récupère une publication par ID
   */
  getPublicationById(id: number): Observable<Publication> {
    return this.http.get<Publication>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  /**
   * Like ou unlike une publication
   */
  toggleLikePublication(publicationId: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/${publicationId}/like`, {}, {
      headers: new HttpHeaders(),
      withCredentials: environment.withCredentials || false,
      responseType: 'text'
    });
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
    return this.http.post<Commentaire>(`${this.apiUrl}/${publicationId}/commenter`, body, this.getHttpOptions());
  }

  /**
   * Like ou retire le like d'un commentaire
   */
  toggleLikeCommentaire(commentaireId: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/commentaires/${commentaireId}/like`, {}, {
      headers: new HttpHeaders(),
      withCredentials: environment.withCredentials || false,
      responseType: 'text'
    });
  }

  /**
   * Convertit une image base64 en File
   */
  base64ToFile(base64: string, filename: string = 'image.jpg'): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  /**
   * Convertit une vidéo blob URL en File
   */
  async blobUrlToFile(blobUrl: string, filename: string = 'video.mp4'): Promise<File> {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type || 'video/mp4' });
  }

  /**
   * Valide les fichiers avant upload
   */
  validateFiles(files: File[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const maxFileSize = 1000 * 1024 * 1024; // 50MB
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'];

    files.forEach((file, index) => {
      // Vérifier la taille
      if (file.size > maxFileSize) {
        errors.push(`Fichier ${index + 1}: Taille trop importante (max 1000MB)`);
      }

      // Vérifier le type
      if (!allowedImageTypes.includes(file.type) && !allowedVideoTypes.includes(file.type)) {
        errors.push(`Fichier ${index + 1}: Type non supporté`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Formate la date de façon relative
   */
  getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'À l\'instant';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}j`;

    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  }
}

