import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateStoryMediaRequest, CreateStoryTextRequest, StoryDto, UserStories } from '../../models/story.dto';
import { UserAuthService } from '../user-auth.service';

@Injectable({ providedIn: 'root' })
export class StoryService {
  private readonly baseUrl = `${environment.apiBase}/api/status`;

  constructor(
    private http: HttpClient,
    private userAuthService: UserAuthService
  ) {
    console.log('StoryService initialisé avec URL:', this.baseUrl);
  }

  listAll(): Observable<StoryDto[]> {
    console.log('=== Début listAll() ===');

    const userId = this.userAuthService.getUserId();
    console.log('ID utilisateur récupéré:', userId);
    console.log('Type de userId:', typeof userId);

    if (!userId) {
      console.error('❌ Aucun utilisateur connecté - userId est null/undefined');
      console.log('Contenu du localStorage:');
      console.log('- jwtToken:', localStorage.getItem('jwtToken'));
      console.log('- userInfo:', localStorage.getItem('userInfo'));
      console.log('- ID:', localStorage.getItem('ID'));
      throw new Error('Utilisateur non connecté');
    }

    const feedUrl = `${this.baseUrl}/feed/${userId}`;
    console.log('URL de l\'API construite:', feedUrl);
    console.log('=== Fin listAll() ===');

    return this.http.get<StoryDto[]>(feedUrl).pipe(
      tap(data => console.log('✅ Réponse API listAll (feed):', data)),
      catchError(error => {
        console.error('❌ Erreur API listAll (feed):', error);
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        console.error('URL appelée:', feedUrl);
        throw error;
      })
    );
  }

  //  méthode pour obtenir les stories groupées par utilisateur
  listAllGroupedByUser(): Observable<UserStories[]> {
    return this.listAll().pipe(
      map(stories => this.groupStoriesByUser(stories))
    );
  }

  // Méthode privée pour regrouper les stories par utilisateur
  private groupStoriesByUser(stories: StoryDto[]): UserStories[] {
    const userStoriesMap = new Map<number, UserStories>();

    stories.forEach(story => {
      if (!userStoriesMap.has(story.userId)) {
        userStoriesMap.set(story.userId, {
          userId: story.userId,
          userFullName: story.userFullName,
          userProfileImage: story.userProfileImage,
          stories: [],
          hasUnreadStories: false,
          totalStories: 0
        });
      }

      const userStories = userStoriesMap.get(story.userId)!;
      userStories.stories.push(story);
      userStories.totalStories++;

      // Vérifier si l'utilisateur a des stories non lues
      if (!this.isStoryRead(story.id)) {
        userStories.hasUnreadStories = true;
      }
    });

    // Trier les stories de chaque utilisateur par date de création
    userStoriesMap.forEach(userStories => {
      userStories.stories.sort((a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    });

    return Array.from(userStoriesMap.values());
  }

  // Méthode pour vérifier si une story a été lue
  private isStoryRead(storyId: number): boolean {
    const readIds = this.getReadStoryIds();
    return readIds.has(storyId);
  }

  // Méthode pour obtenir les IDs des stories lues
  private getReadStoryIds(): Set<number> {
    const raw = localStorage.getItem('readStoryIds');
    const ids: number[] = raw ? JSON.parse(raw) : [];
    return new Set(ids);
  }

  // Méthode pour marquer une story comme lue
  markStoryAsRead(storyId: number): void {
    const readIds = this.getReadStoryIds();
    if (!readIds.has(storyId)) {
      readIds.add(storyId);
      localStorage.setItem('readStoryIds', JSON.stringify(Array.from(readIds)));
    }
  }

  listMine(): Observable<StoryDto[]> {
    console.log('Appel API: GET', `${this.baseUrl}/me`);
    return this.http.get<StoryDto[]>(`${this.baseUrl}/me`).pipe(
      tap(data => console.log('Réponse API listMine:', data)),
      catchError(error => {
        console.error('Erreur API listMine:', error);
        throw error;
      })
    );
  }

  // addText(payload: CreateStoryTextRequest): Observable<StoryDto> {
  //   console.log('Appel API: POST', this.baseUrl, payload);

  //   // Vérifier que l'utilisateur est connecté
  //   const userId = this.userAuthService.getUserId();
  //   if (!userId) {
  //     throw new Error('Utilisateur non connecté');
  //   }

  //   // Utiliser FormData même pour le texte seulement pour éviter l'erreur 415
  //   const form = new FormData();
  //   form.append('text', payload.text);

  //   return this.http.post<StoryDto>(`${this.baseUrl}`, form).pipe(
  //     tap(data => console.log('Réponse API addText:', data)),
  //     // catchError(error => {
  //     //   console.error('Erreur API addText:', error);
  //     //   console.error('Status:', error.status);
  //     //   console.error('Message:', error.message);
  //     //   console.error('URL appelée:', this.baseUrl);
  //     //   console.error('Payload:', payload);

  //     //   // Remonter l'erreur avec plus de contexte
  //     //   if (error.status === 401) {
  //     //     throw new Error('Session expirée, veuillez vous reconnecter');
  //     //   } else if (error.status === 400) {
  //     //     const message = error.error?.message || 'Données invalides';
  //     //     throw new Error(`Erreur de validation: ${message}`);
  //     //   } else if (error.status === 403) {
  //     //     throw new Error('Vous n\'êtes pas autorisé à publier');
  //     //   } else if (error.status === 415) {
  //     //     throw new Error('Format de données non supporté par le serveur');
  //     //   } else if (error.status === 0) {
  //     //     throw new Error('Impossible de se connecter au serveur');
  //     //   } else {
  //     //     throw new Error(`Erreur ${error.status || 'inconnue'}: ${error.message || 'Problème de connexion'}`);
  //     //   }
  //     // })
  //   );
  // }

  // addMedia(request: CreateStoryMediaRequest): Observable<StoryDto> {
  //   console.log('Appel API: POST', this.baseUrl, 'avec fichiers');

  //   // Vérifier que l'utilisateur est connecté
  //   const userId = this.userAuthService.getUserId();
  //   if (!userId) {
  //     throw new Error('Utilisateur non connecté');
  //   }

  //   const form = new FormData();

  //   // Ajouter tous les fichiers avec la clé 'files'
  //   request.files.forEach((file, index) => {
  //     form.append('files', file);
  //   });

  //   if (request.description) {
  //     form.append('text', request.description);
  //   }

  //   return this.http.post<StoryDto>(`${this.baseUrl}`, form).pipe(
  //     tap(data => console.log('Réponse API addMedia:', data)),
  //     // catchError(error => {
  //     //   console.error('Erreur API addMedia:', error);
  //     //   console.error('Status:', error.status);
  //     //   console.error('Message:', error.message);
  //     //   console.error('URL appelée:', this.baseUrl);
  //     //   console.error('Nombre de fichiers:', request.files.length);

  //     //   // Remonter l'erreur avec plus de contexte
  //     //   if (error.status === 401) {
  //     //     throw new Error('Session expirée, veuillez vous reconnecter');
  //     //   } else if (error.status === 400) {
  //     //     const message = error.error?.message || 'Données invalides';
  //     //     throw new Error(`Erreur de validation: ${message}`);
  //     //   } else if (error.status === 403) {
  //     //     throw new Error('Vous n\'êtes pas autorisé à publier');
  //     //   } else if (error.status === 415) {
  //     //     throw new Error('Format de données non supporté par le serveur');
  //     //   } else if (error.status === 0) {
  //     //     throw new Error('Impossible de se connecter au serveur');
  //     //   } else {
  //     //     throw new Error(`Erreur ${error.status || 'inconnue'}: ${error.message || 'Problème de connexion'}`);
  //     //   }
  //     // })
  //   );
  // }

  delete(statusId: number): Observable<void> {
    console.log('Appel API: DELETE', `${this.baseUrl}/${statusId}`);
    return this.http.delete<void>(`${this.baseUrl}/${statusId}`).pipe(
      tap(() => console.log('Story supprimée avec succès')),
      catchError(error => {
        console.error('Erreur API delete:', error);
        throw error;
      })
    );
  }

  // Méthode unifiée pour créer une story (texte, média, ou les deux)
  createStory(request: { text?: string; files?: File[] }): Observable<StoryDto> {
    console.log('Appel API: POST', this.baseUrl, 'createStory unifiée');

    // Vérifier que l'utilisateur est connecté
    const userId = this.userAuthService.getUserId();
    if (!userId) {
      throw new Error('Utilisateur non connecté');
    }

    // Vérifier qu'on a au moins du texte ou des fichiers
    if (!request.text && (!request.files || request.files.length === 0)) {
      throw new Error('Veuillez ajouter du texte ou un média');
    }

    const form = new FormData();

    // Ajouter le texte si présent
    if (request.text) {
      form.append('text', request.text);
    }

    // Ajouter les fichiers si présents
    if (request.files && request.files.length > 0) {
      request.files.forEach((file, index) => {
        form.append('files', file);
      });
    }

    return this.http.post<StoryDto>(`${this.baseUrl}`, form).pipe(
      tap(data => console.log('Réponse API createStory:', data)),
      // catchError(error => {
      //   console.error('Erreur API createStory:', error);
      //   console.error('Status:', error.status);
      //   console.error('Message:', error.message);
      //   console.error('URL appelée:', this.baseUrl);
      //   console.error('Texte présent:', !!request.text);
      //   console.error('Nombre de fichiers:', request.files?.length || 0);

      //   // Remonter l'erreur avec plus de contexte
      //   if (error.status === 401) {
      //     throw new Error('Session expirée, veuillez vous reconnecter');
      //   } else if (error.status === 400) {
      //     const message = error.error?.message || 'Données invalides';
      //     throw new Error(`Erreur de validation: ${message}`);
      //   } else if (error.status === 403) {
      //     throw new Error('Vous n\'êtes pas autorisé à publier');
      //   } else if (error.status === 415) {
      //     throw new Error('Format de données non supporté par le serveur');
      //   } else if (error.status === 0) {
      //     throw new Error('Impossible de se connecter au serveur');
      //   } else {
      //     throw new Error(`Erreur ${error.status || 'inconnue'}: ${error.message || 'Problème de connexion'}`);
      //   }
      // })
    );
  }
}


