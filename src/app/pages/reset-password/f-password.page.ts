import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-f-password',
  templateUrl: './f-password.page.html',
  styleUrls: ['./f-password.page.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule]
})
export class FPasswordPage implements OnInit {

  resetForm!: FormGroup;
phone: any;

  constructor(private router: Router,
    private authService:AuthService,
    private toastController: ToastController,
    private fb: FormBuilder
   ){ }

  ngOnInit(): void {
    // Initialisation du formulaire avec validation
    this.resetForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^\d{9,15}$/)]],
    });
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
    this.showToast('Veuillez entrer un numéro valide', 'danger');
    return;
  }

  const data = { phone: this.resetForm.value.phone };

  this.authService.requestReset(data).subscribe({
    next: (res) => {
      this.showToast('OTP envoyé avec succès');

      // rediriger vers la page de saisie de code OTP
      this.router.navigate(['/otp-verification'], {
         queryParams: { 
          phone: data.phone,
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
