import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonButtons } from '@ionic/angular/standalone';
import { PublicationService } from 'src/app/services/publication.service';
import { ModalController, IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.css'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CommentsPage  implements OnInit {

   @Input() publicationId!: number;
  commentaires: any[] = [];
  newComment: string = '';

  constructor(private modalCtrl: ModalController, private publicationService: PublicationService) {}


  ngOnInit() {
    if (!this.publicationId) {
      console.error('publicationId non défini !');
      return;
    }
    this.loadCommentaires();
  }

  loadCommentaires() {
    this.publicationService.getCommentaires(this.publicationId).subscribe({
      next: (res) => {
        this.commentaires = res;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des commentaires:', err);
      }
    });
  }

  ajouterCommentaire() {
    if (!this.newComment.trim()) return;

    this.publicationService.addCommentaire(this.publicationId, this.newComment).subscribe({
      next: () => {
        this.newComment = '';
        this.loadCommentaires(); // Recharger la liste
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout du commentaire:', err);
      }
    });
  }

  
  // Gérer le like sur un commentaire
  toggleLikeComment(commentaire: any) {
    this.publicationService.toggleLikeCommentaire(commentaire.id).subscribe({
      next: (updatedComment) => {
        commentaire.liked = updatedComment.liked;
        commentaire.nombreLikes = updatedComment.nombreLikes;
      },
      error: (err) => {
        console.error('Erreur lors du like sur le commentaire :', err);
      }
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
