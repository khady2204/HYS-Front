import { Component, OnInit } from '@angular/core';
import { Platform, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Router, RouterModule } from '@angular/router';
import { CreatePublicationData, PublicationService } from '../../services/publication.service';

interface MediaPreview {
  id: string;
  url: string;
  type: 'image' | 'video';
  file?: File;
  description: string;
}

@Component({
  selector: 'app-publication',
  templateUrl: './publication.page.html',
  styleUrls: ['./publication.page.css'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class PublicationPage implements OnInit {

  // Propriétés principales
  texte: string = '';
  medias: MediaPreview[] = [];
  showMediaPreview = false;
  isPublishing = false;
  showMediaModal = false; // 👈 modal média
  Math = Math;

  // Limites et constantes
  readonly MAX_TEXT_LENGTH = 2000;
  readonly MAX_MEDIA_COUNT = 10;
  readonly MAX_DESCRIPTION_LENGTH = 200;

  constructor(
    private platform: Platform,
    private router: Router,
    private publicationService: PublicationService,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.handleNavigationState();
  }
  /**
   * Gère les données reçues lors de la navigation
   */
  private handleNavigationState() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      const state = navigation.extras.state;

      if (state['imageData']) {
        this.addImageFromData(state['imageData']);
      }

      if (state['videoData']) {
        this.addVideoFromData(state['videoData']);
      }
    }
  }

  /**
   * Ajoute une image depuis les données base64
   */
  private async addImageFromData(imageData: string) {
    try {
      const file = this.publicationService.base64ToFile(imageData, 'captured_image.jpg');
      this.addMediaFile(file, 'image', imageData);
    } catch (error) {
      console.error('Erreur ajout image:', error);
      this.showToast('Erreur lors de l\'ajout de l\'image', 'danger');
    }
  }

  /**
   * Ajoute une vidéo depuis l'URL blob
   */
  private async addVideoFromData(videoData: string) {
    try {
      const file = await this.publicationService.blobUrlToFile(videoData, 'captured_video.mp4');
      this.addMediaFile(file, 'video', videoData);
    } catch (error) {
      console.error('Erreur ajout vidéo:', error);
      this.showToast('Erreur lors de l\'ajout de la vidéo', 'danger');
    }
  }

  /**
   * Ajoute un fichier média à la liste
   */
  private addMediaFile(file: File, type: 'image' | 'video', previewUrl: string) {
    if (this.medias.length >= this.MAX_MEDIA_COUNT) {
      this.showToast(`Maximum ${this.MAX_MEDIA_COUNT} médias autorisés`, 'warning');
      return;
    }

    const mediaPreview: MediaPreview = {
      id: this.generateId(),
      url: previewUrl,
      type,
      file,
      description: ''
    };

    this.medias.push(mediaPreview);
    this.showMediaPreview = true;
  }

  /**
   * Prendre une photo
   */
  async takePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (image.dataUrl) {
        await this.addImageFromData(image.dataUrl);
      }
    } catch (error) {
      console.error('Erreur capture photo:', error);
      this.showToast('Erreur lors de la capture photo', 'danger');
    }
  }

  /**
   * Ouvrir la galerie
   */
  // async openGallery() {
  //   try {
  //     const images = await Camera.getPhoto({
  //       source: CameraSource.Photos,
  //       resultType: CameraResultType.DataUrl,
  //       quality: 90,
  //     });

  //     if (images.dataUrl) {
  //       await this.addImageFromData(images.dataUrl);
  //     }
  //   } catch (error) {
  //     console.error('Erreur sélection galerie:', error);
  //     this.showToast('Erreur lors de la sélection', 'danger');
  //   }
  // }
  openGallery() {
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  if (fileInput) {
    fileInput.click();
  }
}
async handleFileInput(event: any) {
  const files: FileList = event.target.files;

  if (!files || files.length === 0) return;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    let previewUrl = '';

    if (file.type.startsWith('image/')) {
      previewUrl = URL.createObjectURL(file);
      this.addMediaFile(file, 'image', previewUrl);
    } else if (file.type.startsWith('video/')) {
      previewUrl = URL.createObjectURL(file);
      this.addMediaFile(file, 'video', previewUrl);
    } else {
      this.showToast('Type de fichier non supporté', 'danger');
    }
  }

  // Reset input pour pouvoir re-sélectionner le même fichier plus tard
  event.target.value = '';
}



  /**
   * Enregistrer une vidéo (placeholder)
   */
  async recordVideo() {
    console.log('Fonction de capture vidéo non encore implémentée');
    this.showToast('Capture vidéo non disponible pour le moment', 'warning');
  }

  /**
   * Prévisualiser un média
   */
  previewMedia(media: MediaPreview) {
    console.log('Prévisualisation:', media);
    this.showToast(`Prévisualisation ${media.type}`, 'success');
  }

  /**
   * Supprimer un média
   */
  removeMedia(mediaId: string) {
    this.medias = this.medias.filter(media => media.id !== mediaId);
    if (this.medias.length === 0) {
      this.showMediaPreview = false;
    }
  }

  /**
   * Mettre à jour la description d'un média
   */
  updateMediaDescription(mediaId: string, description: string) {
    const media = this.medias.find(m => m.id === mediaId);
    if (media) {
      media.description = description;
    }
  }

  /**
   * Caractères restants
   */
  get remainingChars(): number {
    return this.MAX_TEXT_LENGTH - this.texte.length;
  }

  /**
   * Vérifie si on peut publier
   */
  get canPublish(): boolean {
    return !this.isPublishing && (
      (this.texte.trim().length > 0) ||
      (this.medias.length > 0)
    ) && this.remainingChars >= 0;
  }

  /**
   * Publier la publication
   */
  async publier() {
    if (!this.canPublish) return;

    const loading = await this.loadingController.create({
      message: 'Publication en cours...',
      spinner: 'crescent'
    });
    await loading.present();

    this.isPublishing = true;

    try {
      const publicationData: CreatePublicationData = {};

      if (this.texte.trim()) {
        publicationData.texte = this.texte.trim();
      }

      if (this.medias.length > 0) {
        publicationData.fichiers = this.medias.map(media => media.file!);
        publicationData.descriptions = this.medias.map(media => media.description || '');
      }

      if (publicationData.fichiers?.length) {
        const validation = this.publicationService.validateFiles(publicationData.fichiers);
        if (!validation.valid) throw new Error(validation.errors.join('\n'));
      }

      await this.publicationService.creerPublication(publicationData).toPromise();

      await this.showToast('Publication créée avec succès !', 'success');
      this.resetForm();
      this.goBack();

    } catch (error: any) {
      console.error('Erreur publication:', error);
      await this.showToast(error.message || 'Erreur lors de la publication', 'danger');
    } finally {
      this.isPublishing = false;
      await loading.dismiss();
    }
  }

  private resetForm() {
    this.texte = '';
    this.medias = [];
    this.showMediaPreview = false;
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  onTextInput(event: any) {
    // Validation en temps réel si nécessaire
  }

  /**
   * Ouvrir les options médias
   */
  showMediaOptions() {
    this.showMediaModal = true;
  }
}

