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

    if (cleanUrl.includes('https://hsycompartiment.s3')) {
      const startIndex = cleanUrl.indexOf('https://hsycompartiment.s3');
      return cleanUrl.substring(startIndex);
    }

    if (cleanUrl.startsWith('https://')) {
      return cleanUrl;
    }

    if (cleanUrl.startsWith(this.LOCAL_UPLOAD_BASE)) {
      return cleanUrl;
    }

    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      return this.LOCAL_UPLOAD_BASE + cleanUrl;
    }

    

    console.warn('URL d’image de profil non reconnue :', cleanUrl);
    return null;
  }
}
