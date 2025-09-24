import { Component, OnInit} from '@angular/core';
import { Platform } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Router, RouterModule } from '@angular/router';
import { MediaCapture, MediaFile, CaptureVideoOptions, CaptureError } from '@ionic-native/media-capture/ngx';


@Component({
  selector: 'app-ajouter-media',
  templateUrl: './ajouter-media.page.html',
  styleUrls: ['./ajouter-media.page.css'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  providers: [MediaCapture]
})
export class AjouterMediaPage {
  capturedPhoto: string | null = null;
  recordedVideoUrl: string | null = null;
  mode: 'photo' | 'video' = 'photo'; // photo par défaut
  isFrontCamera = false;
  isFlashOn = false;
  isRecording = false;

  constructor(
    private platform: Platform,
    private router: Router, private mediaCapture: MediaCapture
  ) {}

  toggleCamera() {
    this.isFrontCamera = !this.isFrontCamera;
    console.log(this.isFrontCamera ? 'Caméra frontale activée.' : 'Caméra arrière activée.');
  }

  get cameraIcon() {
    return this.isFrontCamera ? 'camera-reverse-outline' : 'camera-outline';
  }

  toggleFlash() {
    this.isFlashOn = !this.isFlashOn;
    console.log(this.isFlashOn ? 'Flash activé.' : 'Flash désactivé.');
  }

  get flashIcon() {
    return this.isFlashOn ? 'flash-outline' : 'flash-off-outline';
  }
  
  /** Changer le mode photo / vidéo */
  switchMode(newMode: 'photo' | 'video') {
    this.mode = newMode;
    console.log('Mode actuel:', this.mode);
  }

  /** Capturer photo ou vidéo selon le mode */
  async captureMedia() {
    if (this.mode === 'photo') {
      await this.takePhoto();
    } else {
      this.captureVideo(); // on lance la capture vidéo
    }
  }

  /** Prendre une photo avec Capacitor Camera */
  async takePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });
      this.capturedPhoto = image.dataUrl!;
      this.recordedVideoUrl = null; // effacer vidéo si existante
    } catch (error) {
      console.error('Erreur lors de la capture photo :', error);
    }
  }

  /** Capturer une vidéo */
  captureVideo() {
    const options: CaptureVideoOptions = { limit: 1, duration:  60 }; // durée max 60s
    
  this.mediaCapture.captureVideo(options)
    .then((value: MediaFile[] | CaptureError) => {
      // Vérifier que c'est bien un tableau de MediaFile
      if (Array.isArray(value)) {
        this.recordedVideoUrl = value[0].fullPath; // chemin du fichier vidéo
        this.capturedPhoto = null;
      } else {
        console.error('Erreur de capture vidéo :', value);
      }
    })
    .catch(err => {
      console.error('Erreur lors de la capture vidéo :', err);
    });
  }

  /** Envoyer photo ou vidéo vers page publication */
  sendToPublication() {
    if (this.capturedPhoto) {
      this.router.navigate(['/publication'], { state: { imageData: this.capturedPhoto } });
    } else if (this.recordedVideoUrl) {
      this.router.navigate(['/publication'], { state: { videoData: this.recordedVideoUrl } });
    } else {
      console.warn('Aucun média à envoyer');
    }
  }

  /** Ouvrir la galerie pour sélectionner photo */
  async openGallery() {
    try {
      if (this.mode === 'photo') {
        const result = await Camera.getPhoto({
          source: CameraSource.Photos,
          resultType: CameraResultType.DataUrl,
          quality: 90,
        });
        this.capturedPhoto = result.dataUrl!;
        this.recordedVideoUrl = null;
        this.router.navigate(['/publication'], { state: { imageData: this.capturedPhoto } });
      } else {
        console.warn('Sélection de vidéos depuis la galerie non supportée.');
      }
    } catch (error) {
      console.error('Erreur lors de la sélection galerie :', error);
    }
  }

  /** Naviguer vers page publication pour écrire du texte */
  writeText() {
    this.router.navigate(['/publication'], { state: { textOnly: true } });
  }

}
