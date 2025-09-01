import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-registration-success',
  templateUrl: './registration-success.page.html',
  styleUrls: ['./registration-success.page.css'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class RegistrationSuccessPage implements OnInit {

  constructor(
    private router:Router) { }

  ngOnInit() {
  }

}
