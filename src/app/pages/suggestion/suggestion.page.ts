import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import { FloatingMenuComponent } from 'src/app/components/floating-menu/floating-menu.component';
import { DropdownDrawerComponent } from 'src/app/components/dropdown-drawer/dropdown-drawer.component';
import { SuggestionService } from 'src/app/services/suggestion/suggestion.service';

@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.page.html',
  styleUrls: ['./suggestion.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, FloatingMenuComponent, DropdownDrawerComponent]
})
export class SuggestionPage implements OnInit {
  
  suggestions: any;

  
  /*suggestions = [
    { name: 'Fatou Ly', compatibility: '93', distance: '5 km', photo: 'assets/img/myLOve/suggestion/user1.png' },
    { name: 'Safy Sankara', compatibility: '90', distance: '2 km', photo: 'assets/img/myLOve/suggestion/user2.png' },
    { name: 'Aicha Ndiaye', compatibility: '86', distance: '13 km', photo: 'assets/img/myLOve/suggestion/user3.png' },
    { name: 'Hawa Sow', compatibility: '78', distance: '8 km', photo: 'assets/img/myLOve/suggestion/user4.png' },
    { name: 'Salma Fall', compatibility: '60', distance: '4 km', photo: 'assets/img/myLOve/suggestion/user5.png' }
  ]
selectedTab: any; */

  constructor(
    private location: Location,
    private suggestionService: SuggestionService
  ) { }

  ngOnInit() {
    this.loadSuggestions();
  }

 // Liste des suggestions
loadSuggestions() {
  const token = localStorage.getItem('jwtToken');

  if (!token) {
    console.warn('Token JWT manquant, utilisateur non authentifié.');
    return;
  }

  this.suggestionService.getSuggestions().subscribe({
    next: (data) => {
      this.suggestions = data;
      console.log('Suggestions loaded:', this.suggestions);
    },
    error: (error) => {
      console.error('Erreur lors du chargement des suggestions:', error);
    }
  });
}


  goBack() {
    this.location.back();
  }

}
