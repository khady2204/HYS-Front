import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { MessageResponse, MessageService } from 'src/app/services/message/message.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ChatPage implements OnInit, AfterViewInit {

  /** Référence vers l'élément en bas de la liste pour le scroll automatique */
  @ViewChild('bottom') bottomRef!: ElementRef;

  /** Informations de l'utilisateur avec qui on discute */
  user: any;

  /** Liste des messages de la conversation */
  messages: MessageResponse[] = [];

  /** Identifiant de l'utilisateur courant */
  currentUserId: number | null = null;

  /** Texte du nouveau message */
  newMessage: string = '';

  /** Fichier sélectionné pour envoi (image ou vidéo) */
  selectedFile: File | null = null;

  /** Aperçu du fichier sélectionné */
  previewUrl: string | null = null;

  /** Gestion de l'enregistrement audio */
  audioChunks: any[] = [];
  mediaRecorder!: MediaRecorder;
  audioBlob: Blob | null = null;
  audioUrl: string | null = null;
  isRecording = false;
  audioDuration: number = 0;

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private authService: UserAuthService,
    private messageService: MessageService,
    private userService: UserService
  ) {}

  /** Après l'initialisation de la vue, scroll vers le bas */
  ngAfterViewInit() {
    this.scrollToBottom();
  }

  /**
   * Initialisation du composant
   * - Vérifie que l'utilisateur est authentifié
   * - Récupère l'utilisateur courant et l'utilisateur cible
   * - Charge les messages
   */
  ngOnInit() {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUserId = this.authService.getUserId() ?? null;

    // Vérifie si l'utilisateur a été passé via la navigation
    const navigation = this.router.getCurrentNavigation();
    const stateUser = navigation?.extras?.state?.['user'];

    // ID utilisateur cible
    const fallbackUserId = stateUser?.id ?? stateUser?.userId
                        ?? (this.route.snapshot.paramMap.get('userId')
                            ? parseInt(this.route.snapshot.paramMap.get('userId')!, 10)
                            : null);

    if (fallbackUserId) {
      this.userService.getProfile(fallbackUserId).subscribe({
        next: (data) => {
          this.user = { id: fallbackUserId, ...data };
          this.loadMessages();
        },
        error: (err) => console.error("Erreur chargement profil :", err)
      });
    }
  }

  /**
   * Retourner le texte à afficher pour le statut de l'utilisateur
   */
  getUserStatus(): string {
    if (!this.user) return '';

    if (this.user.online) {
      return 'En ligne';
    }

    if (this.user.lastOnlineLabel) {
      return this.user.lastOnlineLabel;
    }

    if (this.user.lastOnlineAt) {
      return 'Dernière connexion : ' + this.formatDateTime(this.user.lastOnlineAt); 
    }

    return 'Hors ligne';
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Charge tous les messages avec l'utilisateur courant
   */
  loadMessages() {
    if (!this.user?.id || !this.currentUserId) return;

    this.messageService.getMessageWithUser(this.user.id, this.currentUserId).subscribe({
      next: (data) => {
        this.messages = data;
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (err) => console.error('Erreur chargement messages:', err)
    });
  }

  /**
   * Gestion de la sélection d'un fichier (image/vidéo)
   */
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewUrl = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  /** Supprime le fichier sélectionné et l'aperçu */
  removeSelectedFile(): void {
    this.selectedFile = null;
    this.previewUrl = null;
  }

  /**
   * Démarre l'enregistrement audio
   * - Demande la permission du micro
   * - Enregistre les données audio dans audioChunks
   */
  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = event => this.audioChunks.push(event.data);

      this.mediaRecorder.onstop = () => {
        this.audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.audioUrl = URL.createObjectURL(this.audioBlob);

        // Mesure de la durée de l'audio
        const audio = new Audio(this.audioUrl);
        audio.onloadedmetadata = () => {
          const duration = Math.round(audio.duration);
          this.audioDuration = Number.isFinite(duration) ? duration : 0;
          this.sendAudioMessage();
        };
      };

      this.mediaRecorder.start();
      this.isRecording = true;
    }).catch(err => console.error('Erreur micro :', err));
  }

  /** Arrête l'enregistrement audio */
  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  /**
   * Envoie le message audio
   * - Crée un FormData avec audioBlob
   * - Met à jour la liste des messages
   */
  sendAudioMessage() {
    if (!this.audioBlob || !this.user?.id) return;

    const formData = new FormData();
    formData.append('receiverId', this.user.id.toString());
    formData.append('mediaFile', this.audioBlob, 'audio.webm');
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

  /**
   * Envoie un message texte ou média
   * - Crée un FormData avec le contenu ou le fichier
   * - Vide les champs après envoi
   */
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

  /** Retour à la page précédente */
  goBack() {
    this.location.back();
  }

  /**
   * Compare deux dates et retourne vrai si elles sont le même jour
   */
  isSameDate(date1: string, date2: string): boolean {
    const d1 = new Date(date1), d2 = new Date(date2);
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }

  /**
   * Formate une date en texte lisible : Aujourd'hui, Hier, jour de la semaine ou jj/mm/yyyy
   */
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

  /** Scroll automatique vers le bas de la conversation */
  scrollToBottom() {
    try {
      this.bottomRef?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Erreur scroll :', err);
    }
  }
}
