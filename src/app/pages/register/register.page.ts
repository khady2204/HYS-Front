import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem,IonLabel, IonInput, IonCheckbox, IonButton, IonText, IonImg, IonSelect, IonSelectOption} from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { ToastController, IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, RouterModule
  ]
})
export class RegisterPage implements OnInit{
  registerForm!: FormGroup;
  maxDate!: string;

  constructor(private authService: AuthService,
    private router: Router,
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
  get adress() { return this.registerForm.get('adress');}
  get email() { return this.registerForm.get('email'); }  
  get password() { return this.registerForm.get('password');}
  get datenaissance() { return this.registerForm.get('datenaissance');}
  get phone() { return this.registerForm.get('phone'); }

   
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

  // Soumission du formulaire d'inscription
  async onRegister() {
    if (this.registerForm.invalid) {
      const toast = await this.toastCtrl.create({
        message: 'Veuillez remplir tous les champs correctement.',
        duration: 2000,
        color: 'danger'
      });
      return await toast.present();
    }

    const formData = this.registerForm.value;

    this.authService.register(formData).subscribe({
      next: async () => {
        // Stocker le numéro de téléphone pour vérification OTP plus tard
        localStorage.setItem('phone', formData.phone);

        const toast = await this.toastCtrl.create({
          message: 'Inscription réussie. Code OTP envoyé au numéro !',
          duration: 2500,
          color: 'success'
        });
        await toast.present();

        this.router.navigate(['/validationsms']);
      },
      error: async (err) => {
        const toast = await this.toastCtrl.create({
          message: err.error?.message || 'Erreur lors de l’inscription.',
          duration: 2500,
          color: 'danger'
        });
        await toast.present();
        console.error(err);
      }
    });
  }
}
