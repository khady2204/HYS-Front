import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { MessageResponse, MessageService } from 'src/app/services/message/message.service';
import { UserService } from 'src/app/services/user.service';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ChatPage implements OnInit, AfterViewInit {

  @ViewChild('bottom') bottomRef!: ElementRef;

  user: any;
  messages: MessageResponse[] = [];
  currentUserId: number | null = null;

  newMessage: string = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  /** Audio */
  isRecording = false;
  recordingTime = 0;
  recordingInterval: any;
  audioBlob: Blob | null = null;
  audioUrl: string | null = null;
  audioDuration = 0;

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private authService: UserAuthService,
    private messageService: MessageService,
    private userService: UserService
  ) {}

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnInit() {
    const token = this.authService.getToken();
    if (!token) { this.router.navigate(['/login']); return; }
    this.currentUserId = this.authService.getUserId() ?? null;

    const navigation = this.router.getCurrentNavigation();
    const stateUser = navigation?.extras?.state?.['user'];

    const fallbackUserId = stateUser?.id ?? stateUser?.userId
                        ?? (this.route.snapshot.paramMap.get('userId')
                            ? parseInt(this.route.snapshot.paramMap.get('userId')!, 10)
                            : null);

    if (fallbackUserId) {
      this.userService.getProfile(fallbackUserId).subscribe({
        next: (data) => { 
          this.user = { id: fallbackUserId, ...data }; 
          this.loadMessages();  
          console.log('Utilisateur chargé :', this.user); },
        error: (err) => console.error("Erreur chargement profil :", err)
      });
    }
  }

  getUserStatus(): string {
    if (!this.user) return '';
    if (this.user.online) return 'En ligne';
    if (this.user.lastOnlineLabel) return this.user.lastOnlineLabel;
    if (this.user.lastOnlineAt) return 'Dernière connexion : ' + this.formatDateTime(this.user.lastOnlineAt); 
    return 'Hors ligne';
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
  }

  loadMessages() {
    if (!this.user?.id || !this.currentUserId) return;
    this.messageService.getMessageWithUser(this.user.id, this.currentUserId).subscribe({
      next: (data) => { this.messages = data; setTimeout(() => this.scrollToBottom(), 100); },
      error: (err) => console.error('Erreur chargement messages:', err)
    });
  }

  async takePhoto() {
  try {
    alert('📸 Début de takePhoto()');

    // Vérifie les permissions caméra et photos
    const perm = await Camera.checkPermissions();
    alert(`🔍 Permissions actuelles - Caméra: ${perm.camera}, Photos: ${perm.photos}`);

    let needRequest = false;

    if (perm.camera !== 'granted' || perm.photos !== 'granted') {
      needRequest = true;
      alert('⚠️ Permissions non accordées, demande en cours...');
    }

    if (needRequest) {
      const newPerm = await Camera.requestPermissions({
        permissions: ['camera', 'photos'] as Array<'camera' | 'photos'>
      });

      alert(`📋 Permissions après demande - Caméra: ${newPerm.camera}, Photos: ${newPerm.photos}`);

      if (newPerm.camera !== 'granted') {
        alert('🚫 Permission caméra refusée !');
        return;
      }
      if (newPerm.photos !== 'granted') {
        alert('🚫 Permission galerie refusée !');
        return;
      }
    }

    alert('✅ Permissions OK, prise de photo en cours...');

    // Prendre la photo
    const image: Photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    alert('📷 Photo capturée avec succès');

    this.previewUrl = image.dataUrl || null;
    this.selectedFile = this.dataUrltoFile(
      image.dataUrl || '',
      `photo_${new Date().getTime()}.jpeg`
    );

    alert('🖼️ Image convertie et stockée');

  } catch (err) {
    console.error('Erreur prise de photo :', err);
    alert(`❌ Erreur prise de photo : ${JSON.stringify(err)}`);
  }
}


async pickFromGallery() {
  try {
    // Vérifie les permissions photos
    const perm = await Camera.checkPermissions();
    if (perm.photos !== 'granted') {
      const newPerm = await Camera.requestPermissions({
        permissions: ['photos'] as Array<'photos'>
      });
      if (newPerm.photos !== 'granted') {
        alert('Permission galerie refusée !');
        return;
      }
    }

    // Sélection depuis la galerie
    const image: Photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    });

    this.previewUrl = image.dataUrl || null;
    this.selectedFile = this.dataUrltoFile(
      image.dataUrl || '',
      `photo_${new Date().getTime()}.jpeg`
    );

  } catch (err) {
    console.error('Erreur sélection galerie :', err);
  }
}

// Conversion DataURL -> File
private dataUrltoFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}


/*  Gestion des fichiers sélectionnés */
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewUrl = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  removeSelectedFile() {
    this.selectedFile = null;
    this.previewUrl = null;
  }

  /** Démarre l’enregistrement audio */
async startRecording() {
  try {
    const perm = await VoiceRecorder.hasAudioRecordingPermission();
    if (!perm.value) {
      const req = await VoiceRecorder.requestAudioRecordingPermission();
      if (!req.value) {
        console.warn('Permission micro refusée');
        return;
      }
    }

    await VoiceRecorder.startRecording();
    this.isRecording = true;

    // 🔥 Initialiser et lancer le compteur
    this.recordingTime = 0;
    this.recordingInterval = setInterval(() => {
      this.recordingTime++;
    }, 1000);

  } catch (err) {
    console.error('Erreur démarrage enregistrement:', err);
  }
}

async stopRecording() {
  try {
    const recordingData = await VoiceRecorder.stopRecording();
    this.isRecording = false;

    // 🔥 Stopper le compteur
    if (this.recordingInterval) {
      clearInterval(this.recordingInterval);
      this.recordingInterval = null;
    }

    if (recordingData.value?.recordDataBase64) {
      const base64 = recordingData.value.recordDataBase64;
      const mimeType = recordingData.value.mimeType || 'audio/webm';

      const byteString = atob(base64);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      this.audioBlob = new Blob([ab], { type: mimeType });
      this.audioUrl = URL.createObjectURL(this.audioBlob);
      this.audioDuration = Math.floor((recordingData.value.msDuration || 0) / 1000);
    }

    this.sendAudioMessage();
  } catch (err) {
    console.error('Erreur stop audio:', err);
  }
}

  /** Envoi du message audio */
  sendAudioMessage() {
    if (!this.audioBlob || !this.user?.id) return;

    const formData = new FormData();
    formData.append('receiverId', this.user.id.toString());
    formData.append('mediaFile', this.audioBlob, `audio.${this.audioBlob.type.split('/')[1]}`);
    formData.append('mediaType', 'audio');
    formData.append('audioDuration', this.audioDuration.toString());

    this.messageService.sendMessage(formData).subscribe({
      next: (response) => {
        this.messages.push(response);
        this.audioBlob = null;
        this.audioUrl = null;
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (err) => console.error('Erreur envoi audio :', err)
    });
  }

  sendMessage() {
    if ((!this.newMessage.trim() && !this.selectedFile) || !this.currentUserId || !this.user?.id) return;

    const formData = new FormData();
    formData.append('receiverId', this.user.id.toString());
    if (this.newMessage.trim()) formData.append('content', this.newMessage.trim());
    if (this.selectedFile) {
      formData.append('mediaFile', this.selectedFile);
      formData.append('mediaType', this.selectedFile.type.startsWith('image') ? 'image' : 'video');
    }

    this.messageService.sendMessage(formData).subscribe({
      next: (response) => {
        this.messages.push(response);
        this.newMessage = '';
        this.selectedFile = null;
        this.previewUrl = null;
        const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
        if (fileInput) fileInput.value = '';
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (err) => console.error('Erreur envoi message :', err)
    });
  }

  goBack() { this.location.back(); }

  isSameDate(date1: string, date2: string): boolean {
    const d1 = new Date(date1), d2 = new Date(date2);
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString), today = new Date(), yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() &&
                                           d1.getMonth() === d2.getMonth() &&
                                           d1.getDate() === d2.getDate();

    if (isSameDay(date, today)) return "Aujourd'hui";
    if (isSameDay(date, yesterday)) return "Hier";

    const diffDays = (today.getTime() - date.getTime()) / (1000 * 3600 * 24);
    if (diffDays < 7) {
      const joursSemaine = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
      return joursSemaine[date.getDay()];
    }

    const day = ('0'+date.getDate()).slice(-2);
    const month = ('0'+(date.getMonth()+1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  scrollToBottom() {
    try { this.bottomRef?.nativeElement?.scrollIntoView({ behavior: 'smooth' }); }
    catch (err) { console.error('Erreur scroll :', err); }
  }
}
