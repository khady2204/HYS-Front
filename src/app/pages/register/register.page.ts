import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem,
  IonLabel,
  IonInput,
  IonCheckbox,
  IonButton,
  IonText,
  IonImg } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonContent,RouterModule,
  IonItem,
  IonLabel,
  IonInput,
  IonCheckbox,
  IonButton,
  IonImg]
})
export class RegisterPage {
  registerForm: FormGroup;

  constructor(private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private toastCtrl: ToastController
  ) {
    this.registerForm = this.fb.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      address: ['', Validators.required],
      sex: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      acceptTerms: [false, Validators.requiredTrue],
    });
  }

  async onRegister() {
    if (this.registerForm.invalid) {
      const toast = await this.toastCtrl.create({
        message: 'Veuillez remplir tous les champs.',
        duration: 2000,
        color: 'danger'
      });
      return await toast.present();
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: async () => {
        const toast = await this.toastCtrl.create({
          message: 'Inscription réussie !',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
        this.router.navigate(['/login']);
      },
      error: async (err) => {
        const toast = await this.toastCtrl.create({
          message: 'Erreur lors de l’inscription.',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
        console.error(err);
      }
    });
  }
  


}