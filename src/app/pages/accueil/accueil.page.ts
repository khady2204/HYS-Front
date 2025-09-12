import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { InteretService } from 'src/app/services/interet/interet.service';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.page.html',
  styleUrls: ['./accueil.page.css'],
  standalone: true,
  imports: [IonSpinner, RouterLink,CommonModule, FormsModule, IonicModule]
})
export class AccueilPage implements OnInit {

  myLoveLink: string = '';
  isReady: boolean = false;

  constructor(
    private interetService : InteretService,
    private router: Router
  ) { }

  ngOnInit() {
    this.interetService.getCurrentUserInterets().subscribe({
      next: (interets: any[]) => {
        this.myLoveLink = (interets && interets.length > 0) ? '/dashboard' : '/interets';
        this.isReady = true;
      },
      error: (err) => {
        this.myLoveLink = '/interets';
        this.isReady = true;
        console.error("Erreur :", err)
      }
    })
  }

}
