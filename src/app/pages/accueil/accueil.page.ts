import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.page.html',
  styleUrls: ['./accueil.page.scss'],
  standalone: true,
  imports: [RouterLink,CommonModule, FormsModule]
})
export class AccueilPage implements OnInit {

  services = [
    {label: 'My love', icon: 'assets/icon/coeur.png', link: '/suggestion', color: '#ff008A'},
    {label: 'Santé', icon: 'assets/icon/sante.png', link: '/construction', color: '#2E7D32'},
    {label: 'Voyage', icon: 'assets/icon/avion.png', link: '/construction', color: '#0288D1'},
    {label: 'Education', icon: 'assets/icon/education.png', link: '/construction', color: '#303F9F'},
    {label: 'Religion', icon: 'assets/icon/etoileetcroissant.png', link: '/construction', color: '#6A1B9A'},
    {label: 'Bourse', icon: 'assets/icon/portefeuille.png', link: '/construction', color: '#F9A825'},
  ]

  constructor() { }

  ngOnInit() {
  }

}
