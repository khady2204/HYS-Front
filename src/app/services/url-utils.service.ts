import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlUtilsService {

  private readonly LOCAL_UPLOAD_BASE = 'http://localhost:8081/uploads/';
  private readonly S3_BASE = 'https://hsycompartiment.s3.af-south-1.amazonaws.com/';

  constructor() {}

  /**
   * Nettoie et construit une URL d'image de profil correcte.
   * @param rawUrl L'URL brute renvoyée par le backend ou stockée côté client
   * @returns Une URL propre et utilisable dans <img [src]>
   */
  buildProfileImageUrl(rawUrl: string | null | undefined): string | null {
    if (!rawUrl || rawUrl.trim() === '') return null;

    let cleanUrl = rawUrl.trim();

    // 1. Si c'est déjà une URL S3 complète
    if (cleanUrl.includes('https://hsycompartiment.s3')) {
      const startIndex = cleanUrl.indexOf('https://hsycompartiment.s3');
      return cleanUrl.substring(startIndex);
    }

    // 2. Si c'est une URL HTTPS complète
    if (cleanUrl.startsWith('https://')) {
      return cleanUrl;
    }

    // 3. Si c'est une URL locale
    if (cleanUrl.startsWith(this.LOCAL_UPLOAD_BASE)) {
      return cleanUrl;
    }

    // 4. NOUVEAU : Si c'est un chemin S3 (messages/, profiles/, etc.)
    if (cleanUrl.startsWith('messages/') || 
        cleanUrl.startsWith('profiles/') || 
        cleanUrl.startsWith('publications/') ||
        cleanUrl.startsWith('status_media/')) {
      return this.S3_BASE + cleanUrl;
    }

    // 5. Pour les autres cas non-http, utiliser local
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      return this.LOCAL_UPLOAD_BASE + cleanUrl;
    }

    console.warn('URL d’image de profil non reconnue :', cleanUrl);
    return null;
  }
}