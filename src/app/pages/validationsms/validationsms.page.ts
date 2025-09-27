import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-validationsms',
  templateUrl: './validationsms.page.html',
  styleUrls: ['./validationsms.page.css'],
  standalone: true,
  imports: [ IonicModule , CommonModule, FormsModule, ReactiveFormsModule]
})
export class ValidationsmsPage implements OnInit {
  otpForm!: FormGroup; 
  phoneNumber!: string;
 
  addressEmail!: string;

  
  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
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

}

  