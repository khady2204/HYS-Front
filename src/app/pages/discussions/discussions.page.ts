import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonList, IonHeader, IonTitle, IonToolbar, IonAvatar,
  IonItem, IonLabel, IonBadge, IonItemSliding, IonItemOptions,
  IonItemOption, IonIcon } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';

import { FloatingMenuComponent } from 'src/app/components/floating-menu/floating-menu.component';
import { DropdownDrawerComponent } from 'src/app/components/dropdown-drawer/dropdown-drawer.component';

import { DiscussionResponse, MessageService } from 'src/app/services/message/message.service';
import { UserAuthService } from 'src/app/services/user-auth.service';

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
    private userService: UserAuthService
  ) {}

  /**
   * Initialisation du composant
   * - Redirige vers login si utilisateur non authentifié
   * - Récupère l'utilisateur courant
   * - Charge toutes les discussions
   */
  ngOnInit(): void {
    if (!this.userService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    const user = this.userService.getUser();
    this.userId = user?.id ?? null;
    this.currentUserId = this.userService.getUserId() ?? 0;

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

        this.discussions = data.map(discussion => {
          // Filtre les messages non lus destinés à l'utilisateur courant
          const unreadMessages = discussion.messages.filter(msg =>
            !msg.read && msg.receiverId === this.currentUserId
          );

          // Récupère le timestamp du dernier message pour tri secondaire
          const lastMessage = discussion.messages.length
            ? discussion.messages[discussion.messages.length - 1]
            : null;
          const lastMessageTimestamp = lastMessage ? lastMessage.timestamp : '';

          console.log(`Discussion avec ${discussion.ami.prenom} ${discussion.ami.nom}`);
          console.log(`Messages non lus pour moi:`, unreadMessages.length);
          console.log(`Dernier message:`, lastMessageTimestamp);

          return {
            ...discussion,
            unreadCount: unreadMessages.length,
            lastMessageTimestamp
          };
        })
        .sort((a, b) => {
          // Tri principal : nombre de messages non lus
          const unreadDiff = (b.unreadCount ?? 0) - (a.unreadCount ?? 0);
          if (unreadDiff !== 0) return unreadDiff;

          // Tri secondaire : timestamp du dernier message
          return new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime();
        });

        console.log("Discussions après tri :", this.discussions);
      },
      error: (err) => {
        console.error('Erreur chargement discussions', err);
      }
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
