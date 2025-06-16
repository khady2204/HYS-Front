import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage {

  email = '';
  password = '';
  acceptTerms = false;

  constructor(
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async onLogin() {
    // ✅ Simple validation pour commencer
    if (!this.acceptTerms) {
      const toast = await this.toastCtrl.create({
        message: 'Veuillez accepter les conditions.',
        duration: 2000,
        color: 'warning',
      });
      await toast.present();
      return;
    }

    // ✅ Logique fictive (sans service pour le moment)
    if (this.email === 'test@example.com' && this.password === 'password') {
      const toast = await this.toastCtrl.create({
        message: 'Connexion réussie !',
        duration: 2000,
        color: 'success',
      });
      await toast.present();

      this.router.navigateByUrl('/home'); // 🔁 redirige vers la page d'accueil
    } else {
      const toast = await this.toastCtrl.create({
        message: 'Email ou mot de passe incorrect.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }

}
