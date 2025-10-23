import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { UserAuthService } from './services/user-auth.service';
import { AuthService } from './services/auth.service';
import { InteretService } from './services/interet/interet.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private userAuthService: UserAuthService,
    private authService: AuthService,
    private platform: Platform,
    private interetService : InteretService
  ) {}

  ngOnInit() {
    this.platform.ready().then(() => {
      // Vérifie la session uniquement si l'utilisateur est connecté
      if (this.userAuthService.isAuthenticated()) {
        this.checkSession();
      }

      // Si l’app revient au premier plan
      App.addListener('appStateChange', (state) => {
        if (state.isActive) {
          this.checkSession();
        }
      });

      // Bloque le bouton "retour" si on est sur dashboard
      this.platform.backButton.subscribeWithPriority(10, () => {
        const url = this.router.url;
        // Si connecté
        if (this.userAuthService.isAuthenticated()) {
          // Bloque le retour depuis home ou dashboard
          if (url === '/dashboard' || url === '/accueil' ) {
            return; // bloque le retour
          }
        } else {
          window.history.back(); // Sinon, comportement normal
        }
      });
    });
  }
 
  //Vérifie le statut de l'utilisateur et redirige vers la page appropriée
  
  checkSession() {
    const token = this.userAuthService.getToken();
    const user = this.userAuthService.getUser();

    // Ne fait rien si l'utilisateur n'est pas connecté
    if (!token || !user) return;

    // Appel backend pour vérifier les intérêts
    this.interetService.getCurrentUserInterets().subscribe({
      next: (interets) => {
        if (interets?.length > 0) {
          // Déjà choisi 
          if (this.router.url === '/' || this.router.url === '/home') {
            this.router.navigateByUrl('/dashboard', { replaceUrl: true });
          }
        } else {
          // Pas encore choisi 
          if (this.router.url === '/' || this.router.url === '/home') {
            this.router.navigateByUrl('/accueil', { replaceUrl: true });
          }
        }
      },
      error: (err) => {
        console.warn('Erreur lors de la vérification des intérêts :', err);
        if (err.status === 401) this.userAuthService.clear();
    
      }
    });
  }

}
