import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-f-password',
  templateUrl: './f-password.page.html',
  styleUrls: ['./f-password.page.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule, RouterModule]
})
export class FPasswordPage implements OnInit {

  resetForm!: FormGroup;
email: any;

  constructor(private router: Router,
    private authService:AuthService,
    private toastController: ToastController,
    private fb: FormBuilder
   ){ }

  ngOnInit(): void {
    // Initialisation du formulaire avec validation email et typage strict
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    // S'assurer que email est de type string
    this.email = '';
  }

  async showToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
    });
    toast.present();
  }
  onSendOtp() {
  if (this.resetForm.invalid) {
    this.showToast('Veuillez entrer un email valide', 'danger');
    return;
  }

  const data = { email: this.resetForm.value.email };

  this.authService.requestReset(data).subscribe({
    next: (res) => {
      this.showToast('OTP envoyé avec succès');

      // rediriger vers la page de saisie de code OTP
      this.router.navigate(['/otp-verification'], {
         queryParams: { 
          email: data.email,
        } 
      });
    },
    error: (err) => {
      console.error('Erreur OTP :', err);
      this.showToast('Échec de l’envoi du code', 'danger');
    }
  });
  }
}
