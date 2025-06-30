import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { HeaderSearchComponent } from '../../shared/header-search/header-search.component';

@Component({
  selector: 'app-rencontre',
  templateUrl: './rencontre.page.html',
  styleUrls: ['./rencontre.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderSearchComponent]
})
export class RencontrePage implements OnInit {

  // Liste des stories pour le carousel
  stories = [
    { name: "Adama S.", img: 'assets/img/myLOve/story/story01.png'},
    { name: "Assane F.", img: 'assets/img/myLOve/story/story02.png'},
    { name: "Awa Gaye", img: 'assets/img/myLOve/story/story03.png'},
    { name: "Ablaye G.", img: 'assets/img/myLOve/story/story02.png'},
  ]

  constructor() { }

  ngOnInit() {
  }

}
