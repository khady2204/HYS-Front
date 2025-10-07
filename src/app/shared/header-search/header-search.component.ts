import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FiltreServiceComponent } from 'src/app/components/filtre-service/filtre-service.component';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { NotificationService, NotificationDTO } from 'src/app/services/notification.service';
import { Subscription, interval } from 'rxjs';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.css'],
  standalone: true,
  imports: [RouterLink, FiltreServiceComponent, IonicModule],
})
export class HeaderSearchComponent implements OnInit, OnDestroy {

  userId: number | null = null;
  profileImageUrl: string | null = null;
  filterOpen = false;

  notifications: NotificationDTO[] = [];
  unreadCount = 0;
  private notifSub?: Subscription;
  private autoRefreshSub?: Subscription;

  constructor(
    private userAuthService: UserAuthService,
    private router: Router,
    private notifService: NotificationService
  ) {}

  ngOnInit(): void {
    // ✅ Vérification d'authentification
    if (!this.userAuthService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Chargement des infos utilisateur
    const user = this.userAuthService.getUser();
    this.userId = user?.id ?? null;
    this.profileImageUrl = user?.profileImage ?? null;

    // Abonnement en temps réel aux notifications
    this.notifSub = this.notifService.notifications$.subscribe({
      next: (data) => {
        this.notifications = data;
        console.log("notifs récupérées :", this.notifications)
        this.unreadCount = data.filter(n => !n.lue).length;
      },
      error: (err) => console.error('Erreur de notifications:', err)
    });

    // Chargement initial
    this.notifService.refreshNotifications();

    // Rafraîchissement automatique toutes les 30 secondes
    this.autoRefreshSub = interval(30000).subscribe(() => {
      this.notifService.refreshNotifications();
    });
  }

  // Nettoyage des abonnements
  ngOnDestroy(): void {
    this.notifSub?.unsubscribe();
    this.autoRefreshSub?.unsubscribe();
  }

  // Basculer l'affichage du filtre
  toggleFilter(): void {
    this.filterOpen = !this.filterOpen;
  }

  // Rediriger vers la page de notifications
  goToNotifications(): void {
    this.router.navigate(['/notifications']);
  }
}
