import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButtons, IonBackButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonButtons,CommonModule, IonContent, FormsModule]
})
export class DashboardPage implements OnInit {

  constructor() { }

  services = [
    { label: 'My love', iconPath: 'assets/icon/coeur.png' },
    { label: 'Santé', iconPath: 'assets/icon/sante.png' },
    { label: 'Religion', iconPath: 'assets/icon/etoileetcroissant.png' },
    { label: 'Voyage', iconPath: 'assets/icon/avion.png' },
    { label: 'Education', iconPath: 'assets/icon/education.png' },
    { label: 'Banque', iconPath: 'assets/icon/portefeuille.png' }
  ]

  ngOnInit() {
  }

}
