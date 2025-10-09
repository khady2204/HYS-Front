import { Component, EventEmitter, Output, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';

declare const google: any;

@Component({
  selector: 'app-google-signin-button',
  templateUrl: './google-signin-button.component.html',
  styleUrls: ['./google-signin-button.component.css']
})
export class GoogleSigninButtonComponent implements OnInit, AfterViewInit, OnDestroy {

  @Output() idToken = new EventEmitter<string>();

  private scriptLoaded = false;

  ngOnInit(): void {
    this.loadGoogleScript();
  }

  ngAfterViewInit(): void {
    // Attendre que le script soit chargé avant d'initialiser
    this.initializeGoogleSignIn();
  }

  ngOnDestroy(): void {
    // Nettoyer si nécessaire
  }

  private loadGoogleScript(): void {
    if (this.scriptLoaded) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.scriptLoaded = true;
      this.initializeGoogleSignIn();
    };
    document.head.appendChild(script);
  }

  private initializeGoogleSignIn(): void {
    if (!this.scriptLoaded || !google) return;

    // Initialiser Google Identity Services
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => {
        // Récupérer l'ID token et l'émettre
        if (response.credential) {
          this.idToken.emit(response.credential);
        }
      }
    });

    // Rendre le bouton Google
    google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular'
      }
    );
  }
}
