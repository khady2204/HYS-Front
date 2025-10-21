import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.page.html',
  styleUrls: ['./new-password.page.css'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, ReactiveFormsModule]
})
export class NewPasswordPage implements OnInit {
  passwordForm!: FormGroup;
  email!: string;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastController: ToastController,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });

    // Récupérer les paramètres d’URL
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
  });

  }

  onSubmit() {
    
    // Réinitialiser l'erreur à chaque tentative
    this.error = null;

    // Si le formulaire est invalide, afficher un message d'erreur
    if (this.passwordForm.invalid) {
    this.error='Formulaire invalide';
    return;
  }

  const { newPassword, confirmPassword } = this.passwordForm.value;

  if (newPassword !== confirmPassword) {
    this.error='Les mots de passe ne correspondent pas';
    return;
  }

  if (!this.email) {
    this.error='Email manquant';
    return;
  }

  const data = {
    email: this.email,
    newPassword,
    confirmPassword
  };

  console.log('Données envoyées au backend:', data);

  this.authService.confirmReset(data).subscribe({
    next: (res) => {
      alert('Mot de passe réinitialisé');
      this.router.navigate(['/confirmation']);
    },
    error: (err) => {
      console.error('Erreur :', err);
      this.error='Erreur lors de la réinitialisation';
    }
  });
 }
}
