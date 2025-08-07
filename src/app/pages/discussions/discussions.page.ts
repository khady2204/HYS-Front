import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonList, IonHeader, IonTitle, IonToolbar, IonAvatar,
  IonItem, IonLabel, IonBadge, IonItemSliding, IonItemOptions,
  IonItemOption
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';

import { FloatingMenuComponent } from 'src/app/components/floating-menu/floating-menu.component';
import { DropdownDrawerComponent } from 'src/app/components/dropdown-drawer/dropdown-drawer.component';

import { DiscussionResponse, MessageService } from 'src/app/services/message/message.service';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-discussions',
  templateUrl: './discussions.page.html',
  styleUrls: ['./discussions.page.scss'],
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
  // Affiche ou masque le tiroir déroulant
  showDrawer = false;

  // Liste des discussions avec compteur de non-lus
  discussions: (DiscussionResponse & { unreadCount?: number })[] = [];

  // Identifiants utilisateur
  currentUserId = 0;
  userId: number | null = null;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private userService: UserAuthService
  ) {}

  /**
   * Au chargement du composant :
   * - Redirige vers la page de login si l'utilisateur n'est pas authentifié
   * - Récupère l'utilisateur connecté
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
   * Charge les discussions et calcule les messages non lus pour l'utilisateur courant
   */
  loadDiscussions(): void {
    this.messageService.getAllDiscussions().subscribe({
      next: (data: DiscussionResponse[]) => {
        console.log('🔎 Utilisateur connecté :', this.currentUserId);

        this.discussions = data.map(discussion => {
          const unreadCount = discussion.messages.filter(
            msg => !msg.read && msg.receiverId === this.currentUserId
          ).length;

          console.log(`📬 Discussion avec ${discussion.ami.prenom} ${discussion.ami.nom} — ID: ${discussion.ami.id}`);
          console.log(`Messages total: ${discussion.messages.length}`);
          console.log(`Non lus (pour ${this.currentUserId}) : ${unreadCount}`);

          return { ...discussion, unreadCount };
        }).sort((a, b) => (b.unreadCount ?? 0) - (a.unreadCount ?? 0)); // Trie par nombre de messages non lus

        console.log('✅ Liste finale des discussions enrichies :', this.discussions);
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des discussions', err);
      }
    });
  }

  /**
   * Affiche ou masque le tiroir latéral (DropdownDrawer)
   */
  toggleDrawer(): void {
    this.showDrawer = !this.showDrawer;
  }

  /**
   * Supprime localement une discussion de l'affichage (sans la supprimer côté serveur)
   */
  supprimer(user: any): void {
    this.discussions = this.discussions.filter(
      d => d.ami.id !== user?.user?.id
    );
  }

  /**
   * Navigue vers la page de chat avec un utilisateur donné
   */
  navigateToChat(userId: number): void {
    this.openDiscussion(userId);
  }

  /**
   * Ouvre la discussion et marque les messages non lus comme lus
   */
  openDiscussion(userId: number): void {
    const discussion = this.discussions.find(d => d.ami.id === userId);
    if (!discussion) return;

    // Marque chaque message non lu comme lu côté serveur
    discussion.messages.forEach(msg => {
      if (!msg.read && msg.receiverId === this.currentUserId) {
        msg.read = true; // MAJ immédiate côté frontend
        this.messageService.markMessageAsRead(msg.id).subscribe({
          next: () => console.log(`✅ Message ${msg.id} marqué comme lu`),
          error: (err) => console.error(`❌ Erreur marquage du message ${msg.id}`, err)
        });
      }
    });

    // Réinitialise le compteur local
    discussion.unreadCount = 0;

    // Navigue vers la page de chat en passant l'utilisateur et les messages
    this.router.navigate(['/chat', userId], {
      state: {
        user: discussion.ami,
        messages: discussion.messages
      }
    });
  }
}
