import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { MessageRequest, MessageResponse, MessageService } from 'src/app/services/message/message.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ChatPage implements OnInit {

  @ViewChild('bottom') bottomRef!: ElementRef;

  user: any; // destinataire
  messages: MessageResponse[] = [];
  currentUserId: number | null = null;
  newMessage: string = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;
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

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnInit() {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUserId = this.authService.getUserId() ?? null;

    const navigation = this.router.getCurrentNavigation();
    const stateUser = navigation?.extras?.state?.['user'];

    if (stateUser) {
      // Normalisation
      this.user = {
        id: stateUser.id ?? stateUser.userId, // Assure l'utilisation de 'id'
        ...stateUser
      };
      console.log('✅ Utilisateur reçu depuis navigation state :', this.user);
      this.loadMessages();
    } else {
      const idParam = this.route.snapshot.paramMap.get('userId');
      const fallbackUserId = idParam ? parseInt(idParam, 10) : null;

      if (fallbackUserId) {
        console.warn('⚠️ Utilisateur non présent dans navigation state, récupération via userId:', fallbackUserId);
        this.userService.getProfile(fallbackUserId).subscribe({
          next: (data) => {
            this.user = {
              id: fallbackUserId,
              ...data
            };
            console.log('✅ Utilisateur chargé depuis l\'API :', this.user);
            this.loadMessages();
          },
          error: (err) => {
            console.error("❌ Erreur lors du chargement du profil :", err);
          }
        });
      } else {
        console.error('❌ Aucun utilisateur trouvé dans state ni dans les paramètres');
      }
    }
  }

  loadMessages() {
    if (!this.user?.id || !this.currentUserId) return;

    this.messageService.getMessageWithUser(this.user.id).subscribe({
      next: (data) => {
        this.messages = data.map(msg => ({
          ...msg,
          isSender: msg.senderId === this.currentUserId
        }));
        setTimeout( () => this.scrollToBottom(), 100);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des messages:', err);
      }
    });
  }


  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      //Création d'un aperçu local
      const reader = new FileReader();
      reader.onload = (e:any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      console.log('Fichier sélectionné :', file.name, 'Type :', file.type);
    }
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
    this.previewUrl = null;
  }

  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = event => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        this.audioBlob = new Blob(this.audioChunks, { type: 'audio/webm'});
        this.audioUrl = URL.createObjectURL(this.audioBlob);

        const audio = new Audio(this.audioUrl);
        audio.onloadedmetadata = () => {
          const duration = Math.round(audio.duration);

          // Vérifie que la duré est un nombre valide et fini
          this.audioDuration = Number.isFinite(duration) ? duration: 0;

          this.sendAudioMessage(); // Auto-envoi après arret;
        };
      };

      this.mediaRecorder.start();
      this.isRecording = true;
    }).catch(err => {
      console.error('Erreur accès micro :', err);
    });
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  sendAudioMessage() {
    if (!this.audioBlob || !this.user?.id) return;

    const formData = new FormData();
    formData.append('receiverId', this.user.id.toString());
    formData.append('mediaFile', this.audioBlob, 'audio.webm');
    formData.append('mediaType', 'audio');
    formData.append('audioDuration', this.audioDuration.toString());

    this.messageService.sendMessage(formData).subscribe({
      next: (response: MessageResponse) => {
        this.messages.push({ ...response, isSender: true });
        this.audioBlob = null;
        this.audioUrl = null;
      },
      error: (err) => {
        console.error('Erreur envoi vocal :', err);
      } 
    });
  }


  sendMessage() {
    if ((!this.newMessage.trim() && !this.selectedFile) || !this.currentUserId || !this.user?.id) {
      return;
    }

    const formData = new FormData();
    formData.append('receiverId', this.user.id.toString());

    if (this.newMessage.trim()) {
      formData.append('content', this.newMessage.trim());
    }

    if (this.selectedFile) {

      // Ajoute le fichier
      formData.append('mediaFile', this.selectedFile);

      // AJoute le type du média (image ou vidéo)
      const mediaType = this.selectedFile.type.startsWith('image') ? 'image' : 'video';
      formData.append('mediaType', mediaType);
    }

    this.messageService.sendMessage(formData).subscribe({
      next: (response: MessageResponse) => {
        this.messages.push({
          ...response,
          isSender: true
        });
        this.newMessage = '';
        this.selectedFile = null;

        // Rénitialise le champ fichier dans le DOM
        const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
        if (fileInput) fileInput.value = '';

        setTimeout( () => this.scrollToBottom(), 100);

      },
      error: (err) => {
        console.error('Erreur lors de l\'envoi du message:', err);
      }
    });
  }

  goBack() {
    this.location.back();
  }

  isSameDate(date1: string, date2: string): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (d1: Date, d2: Date) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    if (isSameDay(date, today)) return "Aujourd'hui";
    if (isSameDay(date, yesterday)) return "Hier";

    const diffTime = today.getTime() - date.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    if (diffDays < 7) {
      const joursSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      return joursSemaine[date.getDay()];
    }

    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  scrollToBottom() {
    try {
      this.bottomRef?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Scroll error :', err);
    }
  }
}
