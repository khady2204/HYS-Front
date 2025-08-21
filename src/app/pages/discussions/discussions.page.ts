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
      console.log("📂 Discussions brutes :", data);

      this.discussions = data.map(discussion => {
        // On considère que tous les messages où read === false et
        // l'auteur supposé ≠ currentUserId sont des messages non lus pour moi
        const unreadMessages = discussion.messages.filter(msg => {
          // Si currentUserId correspond à l'ami, ce sont mes propres messages
          // Sinon, ce sont des messages reçus non lus
          const isForMe = discussion.ami.id === this.currentUserId ? false : !msg.read;
          return isForMe;
        });

        console.log(`💬 Discussion avec ${discussion.ami.prenom} ${discussion.ami.nom}`);
        console.log(`📨 Messages non lus pour moi:`, unreadMessages.length);

        return {
          ...discussion,
          unreadCount: unreadMessages.length
        };
      })
      // Trier les discussions par nombre de messages non lus décroissant
      .sort((a, b) => (b.unreadCount ?? 0) - (a.unreadCount ?? 0));

      console.log("📈 Discussions après calcul des badges :", this.discussions);
    },
    error: (err) => {
      console.error('❌ Erreur chargement discussions', err);
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
  console.log('🔍 Ouverture de la discussion avec userId:', userId);

  const discussion = this.discussions.find(d => d.ami.id === userId);
  if (!discussion) {
    console.warn('⚠️ Discussion introuvable pour userId:', userId);
    return;
  }

  console.log('📦 Discussion trouvée:', discussion);

  // Correctif : marquer comme lu tous les messages non lus envoyés par l'autre utilisateur
  const unreadMessages = discussion.messages.filter(msg =>
    !msg.read && msg.senderId !== this.currentUserId
  );

  console.log('👤 ID utilisateur courant:', this.currentUserId);
  console.log(`📨 ${unreadMessages.length} message(s) non lu(s) à marquer`);

  // On marque côté frontend et on appelle le backend
  unreadMessages.forEach(msg => {
    console.log(`➡️ Tentative de marquage du message ${msg.id} comme lu`);
    msg.read = true; // MAJ immédiate côté frontend

    this.messageService.markMessageAsRead(msg.id).subscribe({
      next: () => console.log(`✅ Message ${msg.id} marqué comme lu côté serveur`),
      error: (err) => {
        console.error(`❌ Erreur lors du marquage du message ${msg.id}`, err);
        msg.read = false; // rollback si erreur
      }
    });
  });

  // Réinitialiser le compteur de non-lus côté frontend
  discussion.unreadCount = 0;
  console.log('🔄 Compteur de messages non lus réinitialisé');

  // Naviguer vers le chat avec l'état correct
  this.router.navigate(['/chat', userId], {
    state: {
      user: discussion.ami,
      messages: discussion.messages
    }
  });

  console.log('🚀 Navigation vers /chat avec userId:', userId);
}

}
