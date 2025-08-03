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
import { Router, RouterLink } from '@angular/router';
import { UserAuthService } from 'src/app/services/user-auth.service';

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
    DropdownDrawerComponent,
    RouterLink
  ]
})
export class SuggestionPage implements OnInit {
  
  suggestions: any[] = [];
  userId: number | null = null;

  constructor(
    private location: Location,
    private suggestionService: SuggestionService,
    private userAuthService: UserAuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Vérifie s'il est connecté
    if (!this.userAuthService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    const user = this.userAuthService.getUser();
    this.userId = user?.id ?? null;
    this.loadSuggestions();
  }

  // ✅ Chargement des suggestions filtrées et triées
  loadSuggestions() {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      return;
    }

    this.suggestionService.getSuggestions().subscribe({
      next: (data: any[]) => {
        this.suggestions = data
          .filter(s => s.compatibilite && s.compatibilite > 0)
          .sort((a, b) => b.compatibilite - a.compatibilite);

        console.log('Suggestions chargées:', this.suggestions);
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
