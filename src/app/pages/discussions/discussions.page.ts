import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonList, IonHeader, IonTitle, IonToolbar, IonAvatar,
  IonItem, IonLabel, IonBadge, IonItemSliding, IonItemOptions,
  IonItemOption, IonIcon, IonButton, IonModal
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { forkJoin } from 'rxjs';

// Components
import { FloatingMenuComponent } from 'src/app/components/floating-menu/floating-menu.component';
import { DropdownDrawerComponent } from 'src/app/components/dropdown-drawer/dropdown-drawer.component';
import { StoryViewerComponent } from 'src/app/components/story-viewer/story-viewer.component';

// Services
import { DiscussionResponse, MessageService } from 'src/app/services/message/message.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UserService } from 'src/app/services/user.service';
import { StoryService } from 'src/app/services/story/story.service';

// Models
import { StoryDto, UserStories } from 'src/app/models/story.dto';

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
    IonIcon,
    IonButton,
    IonItemOption,
    IonBadge,
    IonModal,
    FloatingMenuComponent,
    DropdownDrawerComponent,
    StoryViewerComponent
  ]
})
export class DiscussionsPage implements OnInit {

  // ======== PROPRIÉTÉS DISCUSSIONS ========
  /** Affiche ou masque le tiroir déroulant */
  showDrawer = false;

  /** Liste des discussions avec compteur de messages non lus et timestamp du dernier message */
  discussions: (DiscussionResponse & { unreadCount?: number, lastMessageTimestamp?: string })[] = [];

  /** Identifiants utilisateur courant et profil consulté */
  currentUserId = 0;
  userId: number | null = null;
  profileImageUrl: any;

  // ======== PROPRIÉTÉS STORIES ========
  /** Stories groupées par utilisateur */
  userStories: UserStories[] = [];

  /** Mes propres stories */
  myStories: StoryDto[] = [];

  /** Story actuellement sélectionnée pour visualisation */
  selectedUserStories: UserStories | null = null;

  /** États des modals */
  isViewerOpen = false;
  isAddStoryOpen = false;
  isMyStoriesOpen = false;

  /** États de chargement et d'erreur pour les stories */
  isStoriesLoading = false;
  storiesError: string | null = null;

  /** Données du formulaire nouvelle story */
  newStoryText = '';
  newStoryFiles: File[] = [];
  isPosting = false;
  storyError: string | null = null;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private userAuthService: UserAuthService,
    private userService: UserService,
    private storyService: StoryService
  ) {}

  /**
   * Initialisation du composant
   * - Redirige vers login si utilisateur non authentifié
   */
  ngOnInit(): void {
    if (!this.userAuthService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    const user = this.userAuthService.getUser();
    this.userId = user?.id ?? null;
    this.currentUserId = this.userAuthService.getUserId() ?? 0;
    this.profileImageUrl = user?.profileImage ?? null;

    // Chargement des données
    this.loadDiscussions();
    this.loadStories();
    this.loadMyStories();
  }

  // ======== MÉTHODES DISCUSSIONS ========

  /**
   * Charge toutes les discussions et calcule les messages non lus
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

  openOptions(event: Event, slidingItem: any) {
    event.stopPropagation(); // bloque la propagation vers ion-item
    slidingItem.open('end'); // ouvre les options
  }


  // ======== MÉTHODES STORIES ========

  /**
   * Charge les stories de tous les utilisateurs, groupées par utilisateur
   */
  loadStories(): void {
    this.isStoriesLoading = true;
    this.storiesError = null;
    console.log('📖 Chargement des stories groupées...');

    this.storyService.listAllGroupedByUser().subscribe({
      next: (data) => {
        console.log('📚 Stories groupées reçues:', data);
        this.userStories = data;
        this.isStoriesLoading = false;
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des stories:', err);
        this.handleStoriesError(err);
        this.isStoriesLoading = false;
      }
    });
  }

  /**
   * Charge mes propres stories
   */
  loadMyStories(): void {
    this.storyService.listMine().subscribe({
      next: (data) => {
        console.log('📝 Mes stories reçues:', data);
        this.myStories = data;
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement de mes stories:', err);
      }
    });
  }

  /**
   * Gère les erreurs de chargement des stories
   */
  private handleStoriesError(err: any): void {
    if (err.message === 'Utilisateur non connecté') {
      this.storiesError = 'Connectez-vous pour voir les stories';
    } else if (err.status === 404) {
      this.storiesError = 'Service indisponible';
    } else if (err.status === 0) {
      this.storiesError = 'Hors ligne';
    } else {
      this.storiesError = 'Erreur de chargement';
    }
  }

  /**
   * Ouvre le modal d'ajout de story
   */
  openAddStory(): void {
    console.log('➕ Ouverture du modal d\'ajout de story');
    this.isAddStoryOpen = true;
    this.resetStoryForm();
  }

  /**
   * Ouvre le modal de visualisation de mes stories
   */
  openMyStories(): void {
    console.log('👤 Ouverture de mes stories');
    this.isMyStoriesOpen = true;
  }

  /**
   * Ferme le modal de mes stories
   */
  closeMyStories(): void {
    this.isMyStoriesOpen = false;
  }

  /**
   * Ferme le modal d'ajout de story
   */
  closeAddStory(): void {
    this.isAddStoryOpen = false;
    this.resetStoryForm();
  }

  /**
   * Remet à zéro le formulaire de création de story
   */
  resetStoryForm(): void {
    this.newStoryText = '';
    this.newStoryFiles = [];
    this.isPosting = false;
    this.storyError = null;
  }

  /**
   * Gère la sélection de fichiers pour une nouvelle story
   */
  onFileSelected(event: any): void {
    const files = Array.from(event.target.files) as File[];
    if (files.length > 0) {
      this.newStoryFiles = files;
      console.log('📁 Fichiers sélectionnés:', files.map(f => f.name));
    }
  }

  /**
   * Publie une nouvelle story
   */
  async postStory(): Promise<void> {
    // Vérifier que l'utilisateur est connecté
    const userId = this.userAuthService.getUserId();
    if (!userId) {
      this.storyError = 'Veuillez vous connecter pour publier une story';
      return;
    }

    if (!this.newStoryText && this.newStoryFiles.length === 0) {
      this.storyError = 'Veuillez ajouter du texte ou un média';
      return;
    }

    this.isPosting = true;
    this.storyError = null;

    try {
      // Utiliser la méthode unifiée qui gère tous les cas
      const result = await firstValueFrom(this.storyService.createStory({
        text: this.newStoryText || undefined,
        files: this.newStoryFiles.length > 0 ? this.newStoryFiles : undefined
      }));

      console.log('✅ Story publiée avec succès:', result);
      this.closeAddStory();

      // Recharger les stories après publication
      this.loadStories();
      this.loadMyStories();

    } catch (error: any) {
      console.error('❌ Erreur lors de la publication:', error);
      this.handleStoryPostError(error);
    } finally {
      this.isPosting = false;
    }
  }

  /**
   * Gère les erreurs lors de la publication d'une story
   */
  private handleStoryPostError(error: any): void {
    if (error.status === 401) {
      this.storyError = 'Session expirée, veuillez vous reconnecter';
    } else if (error.status === 400) {
      this.storyError = error.error?.message || 'Données invalides';
    } else if (error.status === 403) {
      this.storyError = 'Vous n\'êtes pas autorisé à publier';
    } else if (error.status === 415) {
      this.storyError = 'Format de données non supporté par le serveur';
    } else if (error.status === 0) {
      this.storyError = 'Impossible de se connecter au serveur';
    } else if (error.message) {
      this.storyError = `Erreur: ${error.message}`;
    } else {
      this.storyError = `Erreur ${error.status || 'inconnue'} lors de la publication`;
    }
  }

  /**
   * Ouvre le visualiseur de story pour un utilisateur donné
   */
  openStory(userStories: UserStories): void {
    console.log('👁️ Ouverture du visualiseur pour:', userStories.userFullName);
    this.selectedUserStories = userStories;
    this.isViewerOpen = true;
  }

  /**
   * Ferme le visualiseur de story
   */
  closeViewer(): void {
    console.log('❌ Fermeture du visualiseur');
    this.isViewerOpen = false;
    this.selectedUserStories = null;

    // Recharger les stories pour mettre à jour les statuts de lecture
    this.loadStories();
  }

  /**
   * Supprime une de mes stories
   */
  async deleteStory(storyId: number): Promise<void> {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette story ?')) {
      return;
    }

    try {
      await firstValueFrom(this.storyService.delete(storyId));
      console.log('🗑️ Story supprimée avec succès');

      // Recharger les données après suppression
      this.loadMyStories();
      this.loadStories();

    } catch (error: any) {
      console.error('❌ Erreur lors de la suppression:', error);
      this.handleStoryDeleteError(error);
    }
  }

  /**
   * Gère les erreurs lors de la suppression d'une story
   */
  private handleStoryDeleteError(error: any): void {
    if (error.status === 401) {
      this.storyError = 'Session expirée, veuillez vous reconnecter';
    } else if (error.status === 403) {
      this.storyError = 'Vous n\'êtes pas autorisé à supprimer cette story';
    } else if (error.status === 404) {
      this.storyError = 'Story introuvable';
    } else if (error.status === 0) {
      this.storyError = 'Impossible de se connecter au serveur';
    } else {
      this.storyError = `Erreur ${error.status || 'inconnue'} lors de la suppression`;
    }
  }
}
