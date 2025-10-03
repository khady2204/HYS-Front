import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem,IonLabel, IonInput, IonCheckbox, IonButton, IonText, IonImg, IonSelect, IonSelectOption} from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { ToastController, IonicModule, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.css'],
  standalone: true,
  imports: [NgIf,CommonModule, FormsModule, ReactiveFormsModule, IonicModule, RouterModule,
  ]
})
export class RegisterPage implements OnInit{
  registerForm!: FormGroup;
  maxDate!: string;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private navCtrl: NavController,
    private fb: FormBuilder,
    private toastCtrl: ToastController
  ) {}
  ngOnInit() {
   
    const today = new Date();
     // Calcule la date maximum autorisée : aujourd’hui - 18 ans
    today.setFullYear(today.getFullYear() - 18);
    this.maxDate = today.toISOString().split('T')[0];

    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9,15}$/)]],
      address: ['', Validators.required],
      datenaissance: ['', [Validators.required,this.ageValidator]],
      sexe: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
    }, { validators: this.passwordMatchValidator });
  }

  
  
  get nom() { return this.registerForm.get('nom'); }
  get prenom() { return this.registerForm.get('prenom');}
  get address() { return this.registerForm.get('address');}
  get email() { return this.registerForm.get('email'); }  
  get password() { return this.registerForm.get('password');}
  get datenaissance() { return this.registerForm.get('datenaissance');}
  get phone() { return this.registerForm.get('phone'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
   
  
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  //  Validateur : au moins 18 ans requis
  ageValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const date = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    const dayDiff = today.getDate() - date.getDate();

    const isTooYoung = age < 18 || (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)));

    return isTooYoung ? { tooYoung: true } : null;
  }

  // Soumission du formulaire d'inscription - VERSION MODIFIÉE
    async onRegister() {
      console.log('🔴 ÉTAPE 1: Début onRegister');
      
      if (this.registerForm.invalid) {
        console.log('🔴 Formulaire invalide');
        const toast = await this.toastCtrl.create({
          message: 'Veuillez remplir tous les champs correctement.',
          duration: 2000,
          color: 'danger'
        });
        return await toast.present();
      }

      const formData = this.registerForm.value;
      console.log('🔴 ÉTAPE 2: FormData prêt', formData.email);

      // ✅ TEST SANS TOAST - Utiliser alert() natif
      console.log('🟢 ÉTAPE 3: Avant alert');
      alert('Début inscription...'); // ✅ Alerte native
      console.log('🟢 ÉTAPE 4: Après alert');

      // ✅ APPROCHE AVEC TIMEOUT DE SÉCURITÉ
      try {
        console.log('🔴 ÉTAPE 5: Appel authService.register');
        
        const registerPromise = this.authService.register(formData).toPromise();
        
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout après 10 secondes')), 10000);
        });

        console.log('🔴 ÉTAPE 6: En attente de réponse...');
        
        const response = await Promise.race([registerPromise, timeoutPromise]);
        console.log('🟢 ÉTAPE 7: Réponse reçue:', response);
        
        // ✅ STOCKAGE EMAIL
        localStorage.setItem('email', formData.email);
        console.log('🟢 ÉTAPE 8: Email stocké');

        // ✅ ALERTE SUCCÈS (native)
        alert('Inscription réussie! Redirection...');
        console.log('🟢 ÉTAPE 9: Alerte succès affichée');

        // ✅ REDIRECTION
        setTimeout(() => {
          console.log('🟢 ÉTAPE 10: Redirection vers validationsms');
          this.router.navigate(['/validationsms']);
        }, 1000);

      } catch (error: unknown) {
        console.error('🔴 ERREUR CAPTURÉE:', error);
        
        let errorMessage = 'Erreur inconnue';
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
        
        // ✅ ALERTE ERREUR (native)
        alert('Erreur: ' + errorMessage);
        console.log('🔴 ÉTAPE ERREUR: Alerte erreur affichée');
      }
    }
}
