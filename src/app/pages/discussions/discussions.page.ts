import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonList, IonHeader, IonTitle, IonToolbar, IonAvatar,
  IonItem, IonLabel, IonBadge, IonItemSliding, IonItemOptions,
  IonItemOption, IonIcon } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';

import { forkJoin } from 'rxjs';

import { FloatingMenuComponent } from 'src/app/components/floating-menu/floating-menu.component';
import { DropdownDrawerComponent } from 'src/app/components/dropdown-drawer/dropdown-drawer.component';

import { DiscussionResponse, MessageService } from 'src/app/services/message/message.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-discussions',
  templateUrl: './discussions.page.html',
  styleUrls: ['./discussions.page.css'],
  standalone: true,
  imports: [ 
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonList,
    IonItem,
    IonItemSliding,
    IonItemOptions,
    IonAvatar,
    IonLabel,
    IonItemOption,
    IonBadge,
    FloatingMenuComponent,
    DropdownDrawerComponent
  ]
})
export class DiscussionsPage implements OnInit {

  /** Affiche ou masque le tiroir déroulant */
  showDrawer = false;

  /** Liste des discussions avec compteur de messages non lus et timestamp du dernier message */
  discussions: (DiscussionResponse & { unreadCount?: number, lastMessageTimestamp?: string })[] = [];

  /** Identifiants utilisateur courant et profil consulté */
  currentUserId = 0;
  userId: number | null = null;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private userAuthService: UserAuthService,
    private userService: UserService
  ) {}

  /**
   * Initialisation du composant
   * - Redirige vers login si utilisateur non authentifié
   * - Récupère l'utilisateur courant
   * - Charge toutes les discussions
   */
  ngOnInit(): void {
    if (!this.userAuthService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    const user = this.userAuthService.getUser();
    this.userId = user?.id ?? null;
    this.currentUserId = this.userAuthService.getUserId() ?? 0;

    this.loadDiscussions();
  }

  /**
   * Charge toutes les discussions et calcule les messages non lus
   * Tri principal : messages non lus décroissants
   * Tri secondaire : dernier message le plus récent en haut
   */
  loadDiscussions(): void {
    this.messageService.getAllDiscussions().subscribe({
      next: (data: DiscussionResponse[]) => {
        console.log("📂 Discussions brutes :", data);

        // Créer un tableau d'observables pour récupérer tous les profils
        const profileRequests = data.map(d => this.userService.getProfile(d.ami.id));

        forkJoin(profileRequests).subscribe({
          next: (profiles) => {
            this.discussions = data.map((discussion, i) => {
              const profileData = profiles[i]; // Profil correspondant
              const unreadMessages = discussion.messages.filter(
                msg => !msg.read && msg.receiverId === this.currentUserId
              );
              const lastMessage = discussion.messages.length
                ? discussion.messages[discussion.messages.length - 1]
                : null;
              const lastMessageTimestamp = lastMessage ? lastMessage.timestamp : '';

              return {
                ...discussion,
                ami: { ...discussion.ami, ...profileData },
                unreadCount: unreadMessages.length,
                lastMessageTimestamp
              };
            })
            .sort((a, b) => {
              const unreadDiff = (b.unreadCount ?? 0) - (a.unreadCount ?? 0);
              if (unreadDiff !== 0) return unreadDiff;
              return new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime();
            });

            console.log("📈 Discussions après tri et profils chargés :", this.discussions);
          },
          error: (err) => console.error('❌ Erreur récupération profils', err)
        });
      },
      error: (err) => console.error('❌ Erreur chargement discussions', err)
    });
  }

  /**
   * Retourner le texte à afficher pour le statut de l'utilisateur
   */
  getUserStatus(user: any): string {
    if (!user) return '';
    if (user.online) return 'En ligne';
    if (user.lastOnlineLabel) return user.lastOnlineLabel;
    if (user.lastOnlineAt) return 'Dernière connexion : ' + this.formatDateTime(user.lastOnlineAt);
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

  /** Affiche ou masque le tiroir latéral (DropdownDrawer) */
  toggleDrawer(): void {
    this.showDrawer = !this.showDrawer;
  }

  /**
   * Supprime localement une discussion de l'affichage
   * Attention : ne supprime pas côté serveur
   */
  supprimer(user: any): void {
    this.discussions = this.discussions.filter(
      d => d.ami.id !== user?.user?.id
    );
  }

  /**
   * Navigue vers la page de chat avec un utilisateur donné
   * @param userId ID de l'utilisateur cible
   */
  navigateToChat(userId: number): void {
    this.openDiscussion(userId);
  }

  /**
   * Ouvre une discussion et marque tous les messages non lus comme lus
   * @param userId ID de l'utilisateur cible
   */
  openDiscussion(userId: number): void {
    console.log('Ouverture de la discussion avec userId:', userId);

    const discussion = this.discussions.find(d => d.ami.id === userId);
    if (!discussion) {
      console.warn('Discussion introuvable pour userId:', userId);
      return;
    }

    console.log('Discussion trouvée:', discussion);

    // Marque les messages non lus de l'autre utilisateur
    const unreadMessages = discussion.messages.filter(msg =>
      !msg.read && msg.senderId !== this.currentUserId
    );

    console.log('ID utilisateur courant:', this.currentUserId);
    console.log(`${unreadMessages.length} message(s) non lu(s) à marquer`);

    unreadMessages.forEach(msg => {
      console.log(`Tentative de marquage du message ${msg.id} comme lu`);
      msg.read = true; // MAJ immédiate côté frontend

      // Appel backend pour persister le statut lu
      this.messageService.markMessageAsRead(msg.id).subscribe({
        next: () => console.log(`✅ Message ${msg.id} marqué comme lu côté serveur`),
        error: (err) => {
          console.error(`Erreur lors du marquage du message ${msg.id}`, err);
          msg.read = false; // rollback si erreur
        }
      });
    });

    // Réinitialise le compteur de messages non lus côté frontend
    discussion.unreadCount = 0;
    console.log('Compteur de messages non lus réinitialisé');

    // Navigation vers le chat avec les messages
    this.router.navigate(['/chat', userId], {
      state: {
        user: discussion.ami,
        messages: discussion.messages
      }
    });

    console.log('Navigation vers /chat avec userId:', userId);
  }

}
