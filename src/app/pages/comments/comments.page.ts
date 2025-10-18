import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonButtons } from '@ionic/angular/standalone';
import { PublicationService, Commentaire } from 'src/app/services/publication.service';
import { ModalController, IonicModule } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.css'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CommentsPage implements OnInit {

  @Input() publicationId!: number;
  @Input() publication?: any;

  commentaires: Commentaire[] = [];
  newComment: string = '';
  isLoading: boolean = true;
  isSubmitting: boolean = false;
  error: string | null = null;

  constructor(
    private modalCtrl: ModalController,
    private publicationService: PublicationService
  ) {}

  ngOnInit() {
    if (!this.publicationId) {
      console.error('publicationId non défini !');
      this.error = 'ID de publication manquant';
      this.isLoading = false;
      return;
    }
    this.loadCommentaires();
  }

  /**
   * Charge les commentaires depuis l'API
   */
  loadCommentaires() {
    this.isLoading = true;
    this.error = null;

    this.publicationService.getCommentaires(this.publicationId).subscribe({
      next: (commentaires: Commentaire[]) => {
        console.log('Commentaires chargés:', commentaires);
        this.commentaires = commentaires.map(c => ({
          ...c,
          liked: false // Initialiser le statut liked
        }));
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des commentaires:', err);

        // Gestion d'erreur similaire aux publications
        if (err.status === 200 && err.error?.text) {
          console.log('Réponse texte inattendue:', err.error.text);
          this.commentaires = [];
        } else {
          this.handleError(err);
        }
        this.isLoading = false;
      }
    });
  }

  /**
   * Ajoute un nouveau commentaire
   */
  ajouterCommentaire() {
    if (!this.newComment.trim() || this.isSubmitting) return;

    this.isSubmitting = true;
    this.error = null;

    this.publicationService.ajouterCommentaire(this.publicationId, this.newComment.trim()).subscribe({
      next: (nouveauCommentaire: Commentaire) => {
        console.log('Commentaire ajouté:', nouveauCommentaire);
        this.newComment = '';
        this.loadCommentaires(); // Recharger la liste
        this.isSubmitting = false;

        // Notifier le parent que les commentaires ont été mis à jour
        this.notifyParent();
      },
      error: (err: any) => {
        console.error('Erreur lors de l\'ajout du commentaire:', err);
        this.handleError(err);
        this.isSubmitting = false;
      }
    });
  }

  /**
   * Bascule le like d'un commentaire
   */
  toggleLikeComment(commentaire: Commentaire) {
    const originalLiked = commentaire.liked;
    const originalCount = commentaire.likesCount;

    // Mise à jour optimiste de l'interface
    commentaire.liked = !commentaire.liked;
    commentaire.likesCount += commentaire.liked ? 1 : -1;

    this.publicationService.toggleLikeCommentaire(commentaire.id).subscribe({
      next: (response: string) => {
        console.log('Like commentaire basculé:', response);
        // L'interface a déjà été mise à jour de façon optimiste
      },
      error: (err: any) => {
        console.error('Erreur lors du like commentaire:', err);

        // Si erreur de parsing mais statut 200, on garde la mise à jour
        if (err.status === 200 && err.error?.text) {
          console.log('Like commentaire réussi malgré l\'erreur de parsing:', err.error.text);
        } else {
          // Annuler la mise à jour optimiste en cas d'erreur
          commentaire.liked = originalLiked;
          commentaire.likesCount = originalCount;
          this.handleError(err);
        }
      }
    });
  }

  /**
   * Formate la date de création du commentaire
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
   * Obtient l'URL complète de l'avatar
   */
  getAvatarUrl(commentaire: Commentaire): string {
    if (commentaire.auteurAvatar) {
      if (commentaire.auteurAvatar.startsWith('http')) {
        return commentaire.auteurAvatar;
      }
      return `${environment.apiBase}/media/${commentaire.auteurAvatar}`;
    }
    return 'assets/img/default-avatar.png';
  }

  /**
   * Gère les erreurs de façon centralisée
   */
  private handleError(error: any): void {
    if (error.status === 404) {
      this.error = 'Commentaires non trouvés';
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

  /**
   * Notifie le parent que les commentaires ont été mis à jour
   */
  private notifyParent(): void {
    // Mettre à jour le nombre de commentaires de la publication parent si disponible
    if (this.publication) {
      this.publication.nombreCommentaires = this.commentaires.length;
    }
  }

  /**
   * Ferme la modal
   */
  dismiss() {
    this.modalCtrl.dismiss({
      commentsUpdated: true,
      totalComments: this.commentaires.length
    });
  }

  /**
   * Gère l'événement Enter dans le champ de saisie
   */
  onEnterPressed(event: any) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.ajouterCommentaire();
    }
  }
}
