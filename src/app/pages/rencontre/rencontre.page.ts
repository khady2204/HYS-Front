import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { HeaderSearchComponent } from '../../shared/header-search/header-search.component';
import { FloatingMenuComponent } from 'src/app/components/floating-menu/floating-menu.component';
import { FiltreServiceComponent } from 'src/app/components/filtre-service/filtre-service.component';
import { Publication, Page, PublicationService } from 'src/app/services/publication/publication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-rencontre',
  templateUrl: './rencontre.page.html',
  styleUrls: ['./rencontre.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderSearchComponent, FloatingMenuComponent]
})

export class RencontrePage implements OnInit {

  // Liste des stories pour le carousel
  stories = [
    { name: "Adama S.", img: 'assets/img/myLOve/story/story01.png'},
    { name: "Assane F.", img: 'assets/img/myLOve/story/story02.png'},
    { name: "Awa Gaye", img: 'assets/img/myLOve/story/story03.png'},
    { name: "Ablaye G.", img: 'assets/img/myLOve/story/story02.png'},
  ];

  
  publications: Publication [] = []; // Tableau pour stocker les publications récupérées
   isLoading = true;

  constructor(private publicationService: PublicationService) {}

  ngOnInit() {
    this.getPublications();  // Au chargement du composant, on appelle la méthode pour récupérer les publications  
  }

   /**
 * Récupère la liste des publications depuis le service.
 * S'abonne à l'observable et met à jour le tableau publications avec le contenu reçu.
 * En cas d'erreur, affiche l'erreur dans la console.
 */

  getPublications() {
    this.publicationService.getPublications().subscribe({
      next: (page: Page<Publication>) => {
        this.publications = page.content; 
      },
      error: (err) => {
        console.error('Erreur de chargement des publications', err);
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
    return `${environment.backendUrl}${mediaUrl}`;
  }

  return `${environment.backendUrl}/media/${mediaUrl}`;
}

}
