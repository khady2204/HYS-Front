import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonModal } from '@ionic/angular/standalone';
import { HeaderSearchComponent } from '../../shared/header-search/header-search.component';
import { FloatingMenuComponent } from 'src/app/components/floating-menu/floating-menu.component';
import { StoryService } from '../../services/story/story.service';
import { StoryDto, UserStories } from '../../models/story.dto';
import { environment } from '../../../environments/environment';
import { UserAuthService } from '../../services/user-auth.service';
import { firstValueFrom } from 'rxjs';
import { StoryViewerComponent } from '../../components/story-viewer/story-viewer.component';
import { Page, Publication, PublicationService } from 'src/app/services/publication.service';
import { CommentsPage } from '../comments/comments.page';
import { ModalController, IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

type PublicationWithLike = Publication & { liked: boolean };
@Component({
  selector: 'app-rencontre',
  templateUrl: './rencontre.page.html',
  styleUrls: ['./rencontre.page.css'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,RouterModule, HeaderSearchComponent, FloatingMenuComponent, StoryViewerComponent]
})
export class RencontrePage implements OnInit {

  userStories: UserStories[] = [];
  myStories: StoryDto[] = [];
  selectedUserStories: UserStories | null = null;
  isViewerOpen = false;
  isAddStoryOpen = false;
  isMyStoriesOpen = false;
  isLoading = false;
  error: string | null = null;

  // Form data for new story
  newStoryText = '';
  newStoryFiles: File[] = [];
  isPosting = false;

  publications: PublicationWithLike [] = []; // Tableau pour stocker les publications récupérées
   isLoadingPublications = true;

  constructor(private storyService: StoryService, private userAuthService: UserAuthService,
    private publicationService: PublicationService, private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.loadStories();
    this.loadMyStories();
    this.getPublications();  // Au chargement du composant, on appelle la méthode pour récupérer les publications  
  }

  loadStories(): void {
    this.isLoading = true;
    this.error = null;
    console.log('Chargement des stories groupées...');

    this.storyService.listAllGroupedByUser().subscribe({
      next: (data) => {
        console.log('Stories groupées reçues:', data);
        this.userStories = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des stories:', err);
        if (err.message === 'Utilisateur non connecté') {
          this.error = 'Veuillez vous connecter pour voir les stories';
        } else if (err.status === 404) {
          this.error = 'API non trouvée, vérifiez la configuration';
        } else if (err.status === 0) {
          this.error = 'Impossible de se connecter au serveur';
        } else {
          this.error = `Erreur ${err.status || 'inconnue'}: ${err.message || 'Problème de connexion'}`;
        }
        this.isLoading = false;
      }
    });
  }

  loadMyStories(): void {
    this.storyService.listMine().subscribe({
      next: (data) => {
        console.log('Mes stories reçues:', data);
        this.myStories = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement de mes stories:', err);
      }
    });
  }

  openAddStory(): void {
    console.log('Ouverture du modal d\'ajout de story');
    this.isAddStoryOpen = true;
  }

  openMyStories(): void {
    console.log('Ouverture de mes stories');
    this.isMyStoriesOpen = true;
  }

  closeMyStories(): void {
    this.isMyStoriesOpen = false;
  }

  closeAddStory(): void {
    this.isAddStoryOpen = false;
    this.resetStoryForm();
  }

  resetStoryForm(): void {
    this.newStoryText = '';
    this.newStoryFiles = [];
    this.isPosting = false;
  }

  onFileSelected(event: any): void {
    const files = Array.from(event.target.files) as File[];
    if (files.length > 0) {
      this.newStoryFiles = files;
      console.log('Fichiers sélectionnés:', files.map(f => f.name));
    }
  }

  async postStory(): Promise<void> {
    // Vérifier que l'utilisateur est connecté
    const userId = this.userAuthService.getUserId();
    if (!userId) {
      this.error = 'Veuillez vous connecter pour publier une story';
      return;
    }

    if (!this.newStoryText && this.newStoryFiles.length === 0) {
      this.error = 'Veuillez ajouter du texte ou un média';
      return;
    }

    this.isPosting = true;
    this.error = null;

    try {
      // Utiliser la méthode unifiée qui gère tous les cas
      const result = await firstValueFrom(this.storyService.createStory({
        text: this.newStoryText || undefined,
        files: this.newStoryFiles.length > 0 ? this.newStoryFiles : undefined
      }));

      console.log('Story publiée avec succès:', result);
      this.closeAddStory();
      this.loadStories(); // Recharger les stories
      this.loadMyStories(); // Recharger mes stories aussi
    } catch (error: any) {
      console.error('Erreur lors de la publication:', error);

      // Gestion d'erreur plus détaillée
      if (error.status === 401) {
        this.error = 'Session expirée, veuillez vous reconnecter';
      } else if (error.status === 400) {
        this.error = error.error?.message || 'Données invalides';
      } else if (error.status === 403) {
        this.error = 'Vous n\'êtes pas autorisé à publier';
      } else if (error.status === 415) {
        this.error = 'Format de données non supporté par le serveur';
      } else if (error.status === 0) {
        this.error = 'Impossible de se connecter au serveur';
      } else if (error.message) {
        this.error = `Erreur: ${error.message}`;
      } else {
        this.error = `Erreur ${error.status || 'inconnue'} lors de la publication`;
      }
    } finally {
      this.isPosting = false;
    }
  }

  openStory(userStories: UserStories): void {
    this.selectedUserStories = userStories;
    this.isViewerOpen = true;
  }

  closeViewer(): void {
    this.isViewerOpen = false;
    this.selectedUserStories = null;
  }

  // Debug methods
  getApiBase(): string {
    return environment.apiBase;
  }

  getCurrentUserId(): string | number | null {
    return this.userAuthService.getUserId();
  }

  async deleteStory(storyId: number): Promise<void> {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette story ?')) {
      try {
        await firstValueFrom(this.storyService.delete(storyId));
        console.log('Story supprimée avec succès');
        this.loadMyStories(); // Recharger mes stories
        this.loadStories(); // Recharger toutes les stories
      } catch (error: any) {
        console.error('Erreur lors de la suppression:', error);

        // Gestion d'erreur plus détaillée
        if (error.status === 401) {
          this.error = 'Session expirée, veuillez vous reconnecter';
        } else if (error.status === 403) {
          this.error = 'Vous n\'êtes pas autorisé à supprimer cette story';
        } else if (error.status === 404) {
          this.error = 'Story introuvable';
        } else if (error.status === 0) {
          this.error = 'Impossible de se connecter au serveur';
        } else {
          this.error = `Erreur ${error.status || 'inconnue'} lors de la suppression`;
        }
      }
    }
  }

   /**
 * Récupère la liste des publications depuis le service.
 * S'abonne à l'observable et met à jour le tableau publications avec le contenu reçu.
 * En cas d'erreur, affiche l'erreur dans la console.
 */

  getPublications() {
    this.publicationService.getPublications().subscribe({
      next: (page: Page<Publication>) => {
        this.publications = page.content.map(pub => ({
        ...pub,
        liked: false
      }))as PublicationWithLike[]; 
      this.isLoadingPublications = false; 
      },
      error: (err) => {
        console.error('Erreur de chargement des publications', err);
        this.isLoadingPublications = false;
      }
    });
  }

  /**
   * Construit l'URL complète d'un média à partir d'un chemin relatif ou absolu.
   * - Si mediaUrl est vide, retourne une image par défaut.
   * - Si mediaUrl est une URL complète (http ou data URI), la retourne telle quelle.
   * - Si mediaUrl commence par /uploads/ ou /media/, préfixe avec l'URL backend.
   * - Sinon, considère mediaUrl comme un nom de fichier et ajoute le chemin /media/ du backend.
   * 
   * @param mediaUrl Chemin ou URL du média
   * @returns URL complète accessible du média
  */

  getFullMediaUrl(mediaUrl: string): string {
  if (!mediaUrl) return 'assets/img/default.jpg';

  if (mediaUrl.startsWith('http') || mediaUrl.startsWith('data:')) return mediaUrl;

  // Accepte mediaUrl commençant par /uploads/ ou /media/
  if (mediaUrl.startsWith('/uploads/') || mediaUrl.startsWith('/media/')) {
    return `${environment.apiBase}${mediaUrl}`;
  }

  return `${environment.apiBase}/media/${mediaUrl}`;
}

toggleLike(pub: PublicationWithLike) {
  this.publicationService.toggleLike(pub.id).subscribe({
     next: (res: string) => {
      console.log(res); // "Like toggled"
      // On bascule juste l'état local, sans attendre le backend
      pub.liked = !pub.liked;
      pub.nombreLikes += pub.liked ? 1 : -1;
    },
    error: (err) => {
      console.error("Erreur lors du like :", err);
    }
  });
}


async openComments(pub:PublicationWithLike ) {
  const modal = await this.modalCtrl.create({
    component: CommentsPage,
    componentProps: { publicationId: pub.id }
  });
  return await modal.present();
}

partagerPublication(pub: PublicationWithLike) {
  if (!pub?.id) return;

  const url = `${environment.apiBase}/publications/${pub.id}`;

  if (navigator.share) {
    navigator.share({
      title: 'Voir cette publication',
      text: 'Découvrez cette publication !',
      url: url
    }).then(() => console.log('Publication partagée !'))
      .catch(err => console.error('Erreur partage :', err));
  } else {
    navigator.clipboard.writeText(url)
      .then(() => alert('Lien copié dans le presse-papier !'))
      .catch(err => console.error('Erreur copie lien :', err));
  }
}

}
