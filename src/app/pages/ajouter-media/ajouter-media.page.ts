import { Component, OnInit} from '@angular/core';
import { Platform } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Router, RouterModule } from '@angular/router';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-ajouter-media',
  templateUrl: './ajouter-media.page.html',
  styleUrls: ['./ajouter-media.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
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
    private router: Router
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

  /** Prendre une photo */
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
  /** Ouvrir la galerie pour sélectionner une image */
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
        this.router.navigate(['/publication'], {
          state: { imageData: this.capturedPhoto }
        });
      } else {
        console.warn('La sélection de vidéos depuis la galerie n’est pas encore supportée.');
      }
    } catch (error) {
      console.error('Erreur lors de la sélection galerie :', error);
    }
  }

}

