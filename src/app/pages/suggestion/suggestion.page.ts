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
  styleUrls: ['./suggestion.page.css'],
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
    // Vérifie si l'utilisateur est authentifié
    if (!this.userAuthService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Récupère l'utilisateur connecté
    const user = this.userAuthService.getUser();

    // Normalise l'identifiant utilisateur
    this.userId = user?.id ?? user?.userId ?? null;

    if (!this.userId) {
      console.warn('Identifiant utilisateur introuvable.');
      return;
    }

    this.loadSuggestions();
  }

  // Charge les suggestions compatibles, triées par ordre décroissant de compatibilité
  loadSuggestions() {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      console.warn('Token JWT introuvable.');
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

  getUserState(person: any) {
    return {
      user: {
        id: person.userId,               
        prenom: person.prenom,
        nom: person.nom,
        photoUrl: person.photoUrl,
        phone: person.phone
      }
    };
  }


  // Retour à la page précédente
  goBack() {
    this.location.back();
  }

}
