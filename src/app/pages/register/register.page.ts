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

  constructor(
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
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      const toast = await this.toastCtrl.create({
        message: 'Inscription réussie !',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
    } else {
      const toast = await this.toastCtrl.create({
        message: 'Veuillez remplir tous les champs correctement.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }
  }
  


}