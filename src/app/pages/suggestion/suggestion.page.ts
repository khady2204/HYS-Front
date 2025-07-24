import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { FloatingMenuComponent } from 'src/app/components/floating-menu/floating-menu.component';
import { DropdownDrawerComponent } from 'src/app/components/dropdown-drawer/dropdown-drawer.component';
import { SuggestionService } from 'src/app/services/suggestion/suggestion.service';

@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.page.html',
  styleUrls: ['./suggestion.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    FloatingMenuComponent,
    DropdownDrawerComponent
  ]
})
export class SuggestionPage implements OnInit {
  
  suggestions: any[] = [];

  constructor(
    private location: Location,
    private suggestionService: SuggestionService
  ) {}

  ngOnInit() {
    this.loadSuggestions();
  }

  // ✅ Chargement des suggestions filtrées et triées
  loadSuggestions() {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      console.warn('Token JWT manquant, utilisateur non authentifié.');
      return;
    }

    this.suggestionService.getSuggestions().subscribe({
      next: (data: any[]) => {
        this.suggestions = data
          .filter(s => s.compatibilite && s.compatibilite > 0)
          .sort((a, b) => b.compatibilite - a.compatibilite);

        console.log('Suggestions filtrées et triées:', this.suggestions);
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
