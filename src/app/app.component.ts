import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { UserAuthService } from './services/user-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private userAuthService: UserAuthService,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.checkSession(); //Vérifie  la session au lancement

    this.platform.ready().then(() => {  // Si l’app revient au premier plan
      App.addListener('appStateChange', (state) => {
        if (state.isActive) {
          this.checkSession();
        }
      });
    });

    // Bloque le bouton "retour" si on est sur dashboard
    this.platform.backButton.subscribeWithPriority(10, () => {
      const url = this.router.url;
      // Si connecté
      if (this.userAuthService.isAuthenticated()) {
        // Bloque le retour depuis home ou dashboard
        if (url === '/dashboard' || url === '/home' ) {
          return; // bloque le retour
        }
      } else {
        window.history.back(); // Sinon, comportement normal
      }
    });
  }
 
  //Vérifie le statut de l'utilisateur et redirige vers la page appropriée
  
  checkSession() {
    const token = this.userAuthService.getToken();
    const user = this.userAuthService.getUser();

    if (token && user) {
      // Si l'utilisateur a déjà choisi ses centres d'intérêts, on va vers Dashboard
      if (user.hasInterests) {
        this.router.navigateByUrl('/dashboard', { replaceUrl: true });
      } else {
        // Sinon, il est connecté mais doit encore choisir ses intérêts
        this.router.navigateByUrl('/interets', { replaceUrl: true });
      }
    } else {
      // Première fois ou utilisateur déconnecté : on reste sur Home
      this.router.navigateByUrl('/home', { replaceUrl: true });
    }
  }


}
