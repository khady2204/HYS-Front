import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-validationsms',
  templateUrl: './validationsms.page.html',
  styleUrls: ['./validationsms.page.scss'],
  standalone: true,
  imports: [ IonicModule , CommonModule, FormsModule, ReactiveFormsModule]
})
export class ValidationsmsPage implements OnInit {
  otpForm!: FormGroup; 
  phoneNumber!: string;
  
  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router   
  ) { }

  ngOnInit() {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]],
    });

  // Récupère le numéro stocké précédemment (par exemple dans localStorage)
    this.phoneNumber = localStorage.getItem('phone') || '';

  }

  onSubmit() {
    if (this.otpForm.valid) {
      const otp = this.otpForm.value.otp;
      
      const payload = {
        phone: this.phoneNumber,
        otp: otp,
      };

      this.authService.verifyOtp(payload).subscribe({
        next: (res) => {
          console.log('OTP vérifié', res);
          localStorage.setItem('jwtToken', res.token);
          this.router.navigate(['/login']);
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
