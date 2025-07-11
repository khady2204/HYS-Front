import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule,FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.page.html',
  styleUrls: ['./otp-verification.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class OtpVerificationPage implements OnInit{
otpForm!: FormGroup; 
phone!: string;
  
  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]],
    });

    // Récupérer le phone depuis queryParams (envoyé depuis f-password)
    this.route.queryParams.subscribe((params) => {
      this.phone = params['phone'];
      if (!this.phone) {
        alert('Numéro de téléphone manquant');
        this.router.navigate(['/forgot-password']);
      }
    });
  }

  onSubmit(): void {
    if (this.otpForm.invalid) {
      return;
    }

    const otp = this.otpForm.value.otp;
    const payload = { phone: this.phone, otp };

    console.log('Données envoyées au backend :', payload);

    this.authService.verifyOtpForReset(payload).subscribe({
      next: (res: any) => {
      console.log(' Réponse backend :', res);

      // Si la vérification est réussie
      this.router.navigate(['/new-password'], {
        queryParams: { phone: this.phone } // pour le récupérer dans new-password
      });
    },
    error: (err) => {
      console.error('Erreur serveur :', err);
      alert('OTP invalide ou erreur serveur');
    }
    });
  }
}


  
  


