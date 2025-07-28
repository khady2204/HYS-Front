import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
  standalone: true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule, RouterModule, CommonModule]
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router,
    private authService: AuthService, 
    private toastController: ToastController // Pour afficher des messages toast
  ) {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required,Validators.pattern( /^((\d{9,15})|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}))$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Getters pour accéder facilement aux champs du formulaire dans le HTML
  get identifier() {
    return this.loginForm.get('identifier')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  // Fonction pour afficher un toast (message temporaire à l'écran)
  async showToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message, // Message à afficher
      duration: 3000, // Durée en millisecondes
      color, // Couleur (success ou danger)
    });
    toast.present(); // Affiche le toast
  }

  // Méthode exécutée quand l'utilisateur clique sur "Se connecter"
  onLogin() {
    // Si le formulaire est invalide, afficher un message d'erreur
    if (this.loginForm.invalid) {
      this.showToast('Veuillez corriger les erreurs', 'danger');
      return;
    }
    
    // Récupération des valeurs du formulaire
    const identifierValue = this.loginForm.value.identifier;
    const password = this.loginForm.value.password;

    // Vérifie si c’est un email ou un téléphone
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifierValue);
    const isPhone = /^\d{9,15}$/.test(identifierValue);
    
    let loginPayload: any = { password };

    if (isEmail) {
      loginPayload.email = identifierValue;
    } else if (isPhone) {
      loginPayload.phone = identifierValue;
    } else {
      this.showToast('Identifiant invalide', 'danger');
      return;
    }

    // Appel au service d'authentification
    this.authService.login(loginPayload).subscribe({
      // Si la connexion réussit
      next: (res) => {
        console.log('Réponse complet du backend :', res);
        this.showToast('Connexion réussie !');
        // Stocker le token (si fourni)
        if (res.token) {
          localStorage.setItem('jwtToken', res.token);
        }
        this.router.navigate(['/accueil']); // Redirection vers la page d’accueil
      },
      // Si la connexion échoue (email ou mot de passe incorrect par exemple)
      error: (err) => {
        console.error('Erreur de connexion :', err);
        this.showToast('identifiant ou mot de passe incorrect', 'danger');
      }
    });
  }
}

