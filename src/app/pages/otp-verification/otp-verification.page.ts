import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule,FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.page.html',
  styleUrls: ['./otp-verification.page.css'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class OtpVerificationPage implements OnInit{
otpForm!: FormGroup; 
email!: string;
resendDisabled = false;     // désactive le lien
countdown = 0;              // compteur en secondes
countdownInterval: any;
  
  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alertController : AlertController
  ) { }

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]],
    });

    // Récupérer le emal depuis queryParams (envoyé depuis f-password)
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
      if (!this.email) {
        alert('Email manquant');
        this.router.navigate(['/forgot-password']);
      }
    });
  }

  onSubmit(): void {
    if (this.otpForm.invalid) {
      return;
    }

    const otp = this.otpForm.value.otp;
    const payload = { email: this.email, otp };

    console.log('Données envoyées au backend :', payload);

    this.authService.verifyOtpForReset(payload).subscribe({
      next: (res: any) => {
      console.log(' Réponse backend :', res);

      // Si la vérification est réussie
      this.router.navigate(['/new-password'], {
        queryParams: { email: this.email } // pour le récupérer dans new-password
      });
    },
    error: (err) => {
      console.error('Erreur serveur :', err);
      alert('OTP invalide ou erreur serveur');
    }
    });
  }
   
async confirmResendOtp() {
    if (confirm('Voulez-vous renvoyer le code OTP ?')) {
      this.resendOtp();
    }
}

// Fonction de renvoi OTP
resendOtp() {
  const payload = { email: this.email }; // email récupéré depuis la page précédente

  this.authService.renvoiOtpReset(payload).subscribe({
    next: (res) => {
      console.log('Réponse backend :', res);
      alert('Un nouveau code OTP a été envoyé à votre adresse email.');

    // Désactiver le bouton pendant 10 minutes
    this.resendDisabled = true;
    this.countdown = 10 ; // 10 minutes en secondes
    this.startCountdown();    // Lance le compte

    },
    error: (err) => {
      console.error('Erreur backend :', err);
      alert('Échec de l’envoi du code OTP. Veuillez réessayer.');
    }
  });
}

startCountdown() {
    this.countdownInterval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.resendDisabled = false;
        clearInterval(this.countdownInterval);
      }
    }, 60000);
  }
  
  // Getter pour afficher le compteur en minutes
  get countdownDisplay() {
    return this.countdown.toString();
  }
}


  
  


