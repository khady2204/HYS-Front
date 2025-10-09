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
import { CommentsPage } from '../comments/comments.page';
import { ModalController, IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { RencontreService, Publication } from 'src/app/services/rencontre/rencontre.service';
@Component({
  selector: 'app-rencontre',
  templateUrl: './rencontre.page.html',
  styleUrls: ['./rencontre.page.css'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, HeaderSearchComponent, FloatingMenuComponent, StoryViewerComponent]
})
export class RencontrePage implements OnInit {

  // Stories existantes
  userStories: UserStories[] = [];
  myStories: StoryDto[] = [];
  selectedUserStories: UserStories | null = null;
  isViewerOpen = false;
  isAddStoryOpen = false;
  isMyStoriesOpen = false;
  isLoading = false;
  error: string | null = null;
  Math=Math;

  // Form data for new story
  newStoryText = '';
  newStoryFiles: File[] = [];
  isPosting = false;
  // Publications
  publications: Publication[] = [];
  isLoadingPublications = true;
  currentPage = 0;
  totalPages = 0;
  pageSize = 10;
  constructor(
    private storyService: StoryService,
    private userAuthService: UserAuthService,
    private rencontreService: RencontreService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.loadStories();
    this.loadMyStories();
    this.loadPublications();
  }

  // === MÉTHODES STORIES (inchangées) ===
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
        this.handleError(err);
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
      const result = await firstValueFrom(this.storyService.createStory({
        text: this.newStoryText || undefined,
        files: this.newStoryFiles.length > 0 ? this.newStoryFiles : undefined
      }));

      console.log('Story publiée avec succès:', result);
      this.closeAddStory();
      this.loadStories();
      this.loadMyStories();
    } catch (error: any) {
      console.error('Erreur lors de la publication:', error);
      this.handleError(error);
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

  async deleteStory(storyId: number): Promise<void> {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette story ?')) {
      try {
        await firstValueFrom(this.storyService.delete(storyId));
        console.log('Story supprimée avec succès');
        this.loadMyStories();
        this.loadStories();
      } catch (error: any) {
        console.error('Erreur lors de la suppression:', error);
        this.handleError(error);
      }
    }
  }

  // === NOUVELLES MÉTHODES PUBLICATIONS ===

  /**
   * Charge les publications depuis l'API
   */
  loadPublications(page: number = 0): void {
    this.isLoadingPublications = true;
    this.error = null;

    this.rencontreService.getPublications(page, this.pageSize).subscribe({
      next: (response) => {
        console.log('Publications chargées:', response);
        if (page === 0) {
          this.publications = response.content;
        } else {
          this.publications = [...this.publications, ...response.content];
        }
        this.currentPage = response.number;
        this.totalPages = response.totalPages;
        this.isLoadingPublications = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des publications:', err);
        this.handleError(err);
        this.isLoadingPublications = false;
      }
    });
  }

  /**
   * Charge plus de publications (pagination infinie)
   */
  loadMorePublications(): void {
    if (this.currentPage < this.totalPages - 1 && !this.isLoadingPublications) {
      this.loadPublications(this.currentPage + 1);
    }
  }

  /**
   * Bascule le like d'une publication
   */
  toggleLike(publication: Publication): void {
    this.rencontreService.toggleLike(publication.id).subscribe({
      next: (response: string) => {
        console.log('Like basculé:', response);
        publication.liked = !publication.liked;
        publication.nombreLikes += publication.liked ? 1 : -1;
      },
      error: (err: any) => {
        console.error('Erreur lors du like:', err);

        // Si le statut est 200 mais qu'il y a une erreur de parsing, on considère que ça a fonctionné
        if (err.status === 200 && err.error?.text) {
          console.log('Like réussi malgré l\'erreur de parsing:', err.error.text);
          publication.liked = !publication.liked;
          publication.nombreLikes += publication.liked ? 1 : -1;
        } else {
          this.handleError(err);
        }
      }
    });
  }

  /**
   * Partage une publication
   */
  partagerPublication(publication: Publication): void {
    if (!publication?.id) return;

    this.rencontreService.partagerPublication(publication.id).subscribe({
      next: (response: string) => {
        console.log('Publication partagée:', response);
        publication.nombrePartages += 1;

        // Partage natif si disponible
        const url = `${environment.apiBase}/publications/${publication.id}/partager`;
        if (navigator.share) {
          navigator.share({
            title: 'Voir cette publication',
            text: publication.texte || 'Découvrez cette publication !',
            url: url
          }).catch((err: any) => console.error('Erreur partage natif:', err));
        } else {
          // Fallback: copier le lien
          navigator.clipboard.writeText(url)
            .then(() => alert('Lien copié dans le presse-papier !'))
            .catch((err: any) => console.error('Erreur copie lien:', err));
        }
      },
      error: (err: any) => {
        console.error('Erreur lors du partage:', err);

        // Si le statut est 200 mais qu'il y a une erreur de parsing, on considère que ça a fonctionné
        if (err.status === 200 && err.error?.text) {
          console.log('Partage réussi malgré l\'erreur de parsing:', err.error.text);
          publication.nombrePartages += 1;

          // Partage natif si disponible
          const url = `${environment.apiBase}/publications/${publication.id}`;
          if (navigator.share) {
            navigator.share({
              title: 'Voir cette publication',
              text: publication.texte || 'Découvrez cette publication !',
              url: url
            }).catch((shareErr: any) => console.error('Erreur partage natif:', shareErr));
          } else {
            // Fallback: copier le lien
            navigator.clipboard.writeText(url)
              .then(() => alert('Lien copié dans le presse-papier !'))
              .catch((copyErr: any) => console.error('Erreur copie lien:', copyErr));
          }
        } else {
          this.handleError(err);
        }
      }
    });
  }

  /**
   * Supprime une publication
   */
  async supprimerPublication(publicationId: number): Promise<void> {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) {
      try {
        await firstValueFrom(this.rencontreService.supprimerPublication(publicationId));
        console.log('Publication supprimée avec succès');
        // Retirer la publication de la liste locale
        this.publications = this.publications.filter(pub => pub.id !== publicationId);
      } catch (error: any) {
        console.error('Erreur lors de la suppression:', error);
        this.handleError(error);
      }
    }
  }

  /**
   * Ouvre la modal des commentaires
   */
  async openComments(publication: Publication): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CommentsPage,
      componentProps: {
        publicationId: publication.id,
        publication: publication
      }
    });

    modal.onDidDismiss().then((result: any) => {
      if (result.data?.commentsUpdated) {
        // Recharger les données de la publication si nécessaire
        this.loadPublications(0);
      }
    });

    return await modal.present();
  }

  /**
   * Retourne l'URL complète d'un média
   */
  getFullMediaUrl(mediaUrl: string): string {
    if (!mediaUrl) return 'assets/img/default.jpg';
    if (mediaUrl.startsWith('http') || mediaUrl.startsWith('data:')) return mediaUrl;
    if (mediaUrl.startsWith('/uploads/') || mediaUrl.startsWith('/media/')) {
      return `${environment.apiBase}${mediaUrl}`;
    }
    return `${environment.apiBase}/media/${mediaUrl}`;
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

  /**
   * Détermine si l'utilisateur peut supprimer une publication
   */
  canDeletePublication(publication: Publication): boolean {
    const currentUserId = this.userAuthService.getUserId();
    return currentUserId === publication.userId;
  }

  // === MÉTHODES UTILITAIRES ===

  /**
   * Gère les erreurs de façon centralisée
   */
  private handleError(error: any): void {
    if (error.message === 'Utilisateur non connecté') {
      this.error = 'Veuillez vous connecter pour continuer';
    } else if (error.status === 404) {
      this.error = 'Ressource non trouvée';
    } else if (error.status === 401) {
      this.error = 'Session expirée, veuillez vous reconnecter';
    } else if (error.status === 403) {
      this.error = 'Vous n\'êtes pas autorisé à effectuer cette action';
    } else if (error.status === 0) {
      this.error = 'Impossible de se connecter au serveur';
    } else {
      this.error = `Erreur ${error.status || 'inconnue'}: ${error.message || 'Problème de connexion'}`;
    }
  }

  // Debug methods
  getApiBase(): string {
    return environment.apiBase;
  }

  getCurrentUserId(): string | number | null {
    return this.userAuthService.getUserId();
  }
}
