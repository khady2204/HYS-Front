import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { PublicationService } from 'src/app/services/publication.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.page.html',
  styleUrls: ['./publication.page.css'],
  standalone: true,
  imports: [IonIcon, IonButton, IonInput, IonItem, IonContent, CommonModule, FormsModule]
})
export class PublicationPage  {

  imageData: string | undefined;
  texte: string = '';

  selectedDestination: string = 'Story';
  selectedPrivacy: string = 'Followers';

  constructor( private router: Router,
    private publicationService : PublicationService,
    private alertController: AlertController
  )
   {  
    const nav = this.router.getCurrentNavigation();
    this.imageData = nav?.extras.state?.['imageData'];
    console.log('image reçue dans publication : ', this.imageData);
  }

  goBack() {
  this.router.navigate(['/ajouter-media']); 
  }

  // Convertit base64 en Blob
  base64ToBlob(base64: string, contentType = 'image/jpeg'): Blob {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

  async submitPost() {
    if (!this.texte.trim() && !this.imageData) {
      this.showAlert('Erreur', 'Veuillez saisir un texte ou sélectionner une image.');
      return;
    }

    let mediaBlob: Blob | undefined = undefined;
    if (this.imageData && this.imageData.startsWith('data:image')) {
      mediaBlob = this.base64ToBlob(this.imageData, 'image/jpeg');
    }

    this.publicationService.posterPublication(this.texte, mediaBlob).subscribe({
      next: async (res) => {
        console.log('Publication réussie', res);
        await this.showAlert('Succès', 'Votre publication a été envoyée.');
        this.texte = '';
        this.imageData = undefined;
        this.router.navigate(['/dashboard']); 
      },
      error: async (err) => {
        console.error('Erreur lors de la publication', err);
        await this.showAlert('Erreur', 'Une erreur est survenue lors de la publication.');
      }
    });
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async selectStoryOrProfil() {
    const alert = await this.alertController.create({
      header: 'Publier dans',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: (data) => {
            this.selectedDestination = data === 'story' ? 'Story' : 'Profil';
          }
        }
      ],
      inputs: [
        {
          label: 'Story',
          type: 'radio',
          value: 'story',
          checked: this.selectedDestination.toLowerCase() === 'story'
        },
        {
          label: 'Profil',
          type: 'radio',
          value: 'profil',
          checked: this.selectedDestination.toLowerCase() === 'profil'
        }
      ]
    });

    await alert.present();
  }

  async selectConfidentiality() {
    const alert = await this.alertController.create({
      header: 'Confidentialité',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: (data) => {
            this.selectedPrivacy = data === 'followers' ? 'Followers' : 'Tout le monde';
          }
        }
      ],
      inputs: [
        {
          label: 'Followers',
          type: 'radio',
          value: 'followers',
          checked: this.selectedPrivacy.toLowerCase() === 'followers'
        },
        {
          label: 'Tout le monde',
          type: 'radio',
          value: 'all',
          checked: this.selectedPrivacy.toLowerCase() === 'tout le monde'
        }
      ]
    });

    await alert.present();
  }
  
}