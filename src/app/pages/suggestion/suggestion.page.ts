import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import { HeaderSearchComponent } from '../../shared/header-search/header-search.component';

@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.page.html',
  styleUrls: ['./suggestion.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class SuggestionPage implements OnInit {

  

  suggestions = [
    { name: 'Fatou Ly', compatibility: '93', distance: '5 km', photo: 'assets/img/myLOve/suggestion/user1.png' },
    { name: 'Safy Sankara', compatibility: '90', distance: '2 km', photo: 'assets/img/myLOve/suggestion/user2.png' },
    { name: 'Aicha Ndiaye', compatibility: '86', distance: '13 km', photo: 'assets/img/myLOve/suggestion/user3.png' },
    { name: 'Hawa Sow', compatibility: '78', distance: '8 km', photo: 'assets/img/myLOve/suggestion/user4.png' },
    { name: 'Salma Fall', compatibility: '60', distance: '4 km', photo: 'assets/img/myLOve/suggestion/user5.png' }
  ]
selectedTab: any;

  constructor() { }

  ngOnInit() {
  }

}
