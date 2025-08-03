import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from "@ionic/angular";
import { UserAuthService } from 'src/app/services/user-auth.service';
import { MessageRequest, MessageResponse, MessageService } from 'src/app/services/message/message.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ChatPage implements OnInit {

  user: any; // destinataire
  messages: MessageResponse[] = [];
  currentUserId: number | null = null;
  newMessage: string = '';

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private authService: UserAuthService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const navigation = this.router.getCurrentNavigation();
    this.user = navigation?.extras?.state?.['user'];

    const userId = this.authService.getUserId();
    this.currentUserId = userId ? parseInt(userId.toString(), 10) : null;

    if (!this.user) {
      const id = this.route.snapshot.paramMap.get('userId');
      console.warn('Aucun utilisateur trouvé dans l\'état ou les paramètres de la route. ID:', id);
      // Possibilité d’appel API ici pour récupérer user
    }

    this.loadMessages();
  }

  loadMessages() {
    if (!this.user?.id || !this.currentUserId) return;

    this.messageService.getMessageWithUser(this.user.id).subscribe({
      next: (data) => {
        this.messages = data.map(msg => ({
          ...msg,
          isSender: msg.senderId === this.currentUserId
        }));
      },
      error: (err) => {
        console.error('Erreur lors du chargement des messages:', err);
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.currentUserId || !this.user?.id) {
      return;
    }

    const request: MessageRequest = {
      receiverId: this.user.id,
      content: this.newMessage.trim()
    };

    this.messageService.sendMessage(request).subscribe({
      next: (response: MessageResponse) => {
        this.messages.push({
          ...response,
          isSender: true
        });
        this.newMessage = '';
      },
      error: (err) => {
        console.error('Erreur lors de l\'envoi du message:', err);
      }
    });
  }

  goBack() {
    this.location.back();
  }

  // Comparaison simple entre deux dates (jour, mois, année)
  isSameDate(date1: string, date2: string): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  // Formatage personnalisé des dates des messages
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (d1: Date, d2: Date) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    if (isSameDay(date, today)) {
      return "Aujourd'hui";
    }

    if (isSameDay(date, yesterday)) {
      return "Hier";
    }

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

}
