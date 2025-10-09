import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-validationsms',
  templateUrl: './validationsms.page.html',
  styleUrls: ['./validationsms.page.css'],
  standalone: true,
  imports: [ IonicModule , CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class ValidationsmsPage implements OnInit {
  otpForm!: FormGroup; 
  phoneNumber!: string;
  addressEmail!: string;
  resendDisabled = false;     // désactive le lien
  countdown = 0;              // compteur en secondes
  countdownInterval: any;

  
  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]],
    });

  // Récupère l'email stocké précédemment
    this.addressEmail = localStorage.getItem('email') || '';

  }

  onSubmit() {
    if (this.otpForm.valid) {
      const otp = this.otpForm.value.otp;
      
      const payload = {
        email: this.addressEmail,
        otp: otp,
      };

      this.authService.verifyOtp(payload).subscribe({
        next: (res) => {
          console.log('OTP vérifié', res);
          localStorage.setItem('jwtToken', res.token);
          this.router.navigate(['/registration-success']);
        },
        error: (err) => {
          console.error('OTP invalide', err);
        },
      });
    } else {
      console.log('Formulaire invalide');
    }
  }
  
  
async confirmResendOtp() {
  const alert = await this.alertController.create({
    header: 'Confirmation',
    message: 'Voulez-vous renvoyer le code OTP ?',
    buttons: [
      {
        text: 'Annuler',
        role: 'cancel'
      },
      {
        text: 'Oui',
        handler: () => {
          this.resendOtp();
        }
      }
    ]
  });

  await alert.present();
}

// Fonction de renvoi OTP
resendOtp() {
  console.log('Nouveau OTP envoyé ');
  // Ici on appelle le service pour renvoyer le code

  // Désactiver le bouton pendant 10 minutes
  this.resendDisabled = true;
  this.countdown = 10 ; // 10 minutes en secondes
  this.startCountdown();    // Lance le compte
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

  