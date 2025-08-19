
import { Component, OnInit} from '@angular/core';
import { Platform } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { MediaFile, CaptureVideoOptions, MediaCapture } from '@awesome-cordova-plugins/media-capture/ngx';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-ajouter-media',
  templateUrl: './ajouter-media.page.html',
  styleUrls: ['./ajouter-media.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  providers: [MediaCapture]
})
export class AjouterMediaPage {
  capturedPhoto: string | null = null;
  recordedVideoUrl: string | null = null;
  mode: 'photo' | 'video' = 'photo'; // mode sélectionné, photo par défaut
  isFrontCamera = false;
  isFlashOn = false;

  constructor(
    private mediaCapture: MediaCapture,
    private platform: Platform,
    private router: Router
  ) {}

  toggleCamera() {
  this.isFrontCamera = !this.isFrontCamera;
  if (this.isFrontCamera) {
    console.log('Caméra frontale activée.');
  } else {
    console.log('Caméra arrière activée.');
  }
}

get cameraIcon() {
  return this.isFrontCamera ? 'camera-reverse-outline' : 'camera-outline';
}

  toggleFlash() {
    this.isFlashOn = !this.isFlashOn;
    if (this.isFlashOn) {
    console.log('Le flash est maintenant activé.');
    } else {
    console.log('Le flash est maintenant désactivé.');
    }
  }

  get flashIcon() {
    return this.isFlashOn ? 'flash-outline' : 'flash-off-outline';
    
  }

  /**
   * Prend une photo avec la caméra de l'appareil
   * Utilise l'API Camera avec une qualité de 90 et sans édition
   * Stocke la photo capturée en base64 dans capturedPhoto
   * En cas d'erreur, affiche un message dans la console
   */


  async takePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      this.capturedPhoto = image.dataUrl!;
    } catch (error) {
      console.error('Erreur lors de la capture photo :', error);
    }
  }

  
  /**
   * Démarre l'enregistrement vidéo (uniquement sur mobile via Capacitor)
   * Limite la durée à 30 secondes et capture une seule vidéo
   * Récupère l'URL de la vidéo enregistrée et la stocke dans recordedVideoUrl
   * Gère les erreurs et les cas où aucun fichier vidéo valide n'est retourné
   */

  async startVideoRecording() {
    if (!this.platform.is('capacitor')) {
      console.warn('La capture vidéo ne fonctionne que sur appareil mobile.');
      return;
    }

    const options: CaptureVideoOptions = {
      limit: 1,
      duration: 30
    };

    try {
      const result: any = await this.mediaCapture.captureVideo(options);

    if (Array.isArray(result) && result.length > 0) {
    const mediaFiles = result as MediaFile[];
    const file = mediaFiles[0];
    this.recordedVideoUrl = file.fullPath;
    console.log('Vidéo enregistrée à :', this.recordedVideoUrl);
   } else {
    console.warn('Le résultat ne contient pas de fichiers média valides.');
   }
    } catch (error) {
      console.error('Erreur lors de la capture vidéo :', error);
    }
  }
  
  
  /**
   * Selon le mode sélectionné, lance la prise de photo ou l'enregistrement vidéo
   */

  async onCaptureClick() {
    if (this.mode === 'photo') {
      await this.takePhoto();
    } else if (this.mode === 'video') {
      await this.startVideoRecording();
    }
  }
  
  /**
   * Ouvre la galerie photo de l'appareil pour sélectionner une image (uniquement en mode photo)
   * Stocke l'image sélectionnée en base64 dans capturedPhoto et réinitialise recordedVideoUrl
   * Navigue vers la page publication en passant l'image en état de navigation
   * En mode vidéo, affiche un avertissement que la sélection n'est pas prise en charge
   * Gère les erreurs éventuelles
   */

  async openGallery() {
    try {
      if (this.mode === 'photo') {
        const result = await Camera.getPhoto({
          source: CameraSource.Photos,
          resultType: CameraResultType.DataUrl,
          quality: 90
        });

        this.capturedPhoto = result.dataUrl!;
        this.recordedVideoUrl = null;
        console.log('Image sélectionnée depuis la galerie');
        this.router.navigate(['/publication'],{
        state: { imageData: this.capturedPhoto}
        });

      } else {
        console.warn('La sélection de vidéos depuis la galerie n’est pas encore prise en charge.');
      }
    } catch (error) {
      console.error('Erreur lors de la sélection depuis la galerie :', error);
    }
  }

}

