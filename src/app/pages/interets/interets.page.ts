import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, SelectControlValueAccessor } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonCheckbox, IonButton, IonText, IonRow, IonCol } from '@ionic/angular/standalone';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { InteretService } from 'src/app/services/interet/interet.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-interets',
  templateUrl: './interets.page.html',
  styleUrls: ['./interets.page.scss'],
  standalone: true,
  imports: [IonCol, IonRow, IonText, IonButton, IonCheckbox, IonLabel, IonItem, IonList, IonContent, CommonModule, FormsModule]
})
export class InteretsPage implements OnInit {

  interets: any[] = [];
  selectedInterets: number[] = [];
  userId: number | null = null;

  leftColumn: any[] = [];
  rightColumn: any[] = [];

  constructor(
    private userAuthService: UserAuthService,
    private interetService: InteretService,
    private router: Router,
    private toastController: ToastController
  ) { }

  

  ngOnInit() {
    const token = localStorage.getItem('jwtToken');

    console.log("Token JWT:", token);
    // Vérifie si l'utilisateur est authentifié
    if(!token) {
      console.warn('Utilisateur non authentifié, redirection vers la page de connexion.');
      this.router.navigate(['/login']);
      return;
    }

    const id = this.userAuthService.getId();
    this.userId = id ? Number(id) : null;

    this.interetService.getAllInterets().subscribe({
      next: (interets: any[]) => {
      try {
        console.log('Réponse brute JSON:', interets);

        const parsed = interets;

        // Vérifie si l'utilisateur apparait dans au moins un intérét
        const dejaInscrit = interets.some(interet => interet.users?.some((user: any) => Number(user.id) === this.userId));
        const userAlreadyHasInterets = dejaInscrit || interets.some(interet => interet.users?.some((user: any) => user.id === this.userId));

        if (dejaInscrit) {
          console.log("Utilisateur déjà inscrit à un ou plusieurs intérêts.");
          this.router.navigate(['/dashboard']);
          return;
        }

        // Sinon, charger les interets normalement
        this.interets = parsed.map((i: any) => ({
          id: i.id,
          nom: i.nom
        }));
        const middle = Math.ceil(this.interets.length / 2);
        this.leftColumn = this.interets.slice(0, middle);
        this.rightColumn = this.interets.slice(middle)
      } catch (e) {
        console.error("Erreur de parsing JSON:", e);
      }
    },
      error: (error) => {
        console.error('Erreur lors de la récupération des intérêts:', error);
      }
    });
  }


  toggleSelection(interetId: number) {
    if (this.selectedInterets.includes(interetId)) {
      this.selectedInterets = this.selectedInterets.filter(id => id !== interetId);     
    } else {
      this.selectedInterets.push(interetId);
    }
  }

  envoyerChoix() {
    if (!this.userId) {
      console.warn("Utilisateur non connecté.");
      return;
    }

    if (this.selectedInterets.length === 0) {
      console.warn ("Aucun intérêt sélectionné.");
      this.showToast("Veuillez sélectionner au moins un centre d'interet", 'danger')
      return;
    }

   this.interetService.createInteret({
    userId: this.userId,
    interets: this.selectedInterets
   }).subscribe({
    next: () => {
      this.showToast("Choix enregistré avec succès !", 'success' );
      this.router.navigate(['/suggestion']);
    },
    error: (err) => {
      console.error("Erreur lors de l'envoi des interets:", err);
      this.showToast("Erreur lors de l'envoi des centres d'intérêt. Veuillez réessayer.", 'danger' );
    }
   });
  } 

  
  async showToast(message: string, color: 'success' | 'danger' = 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
    });
    toast.present();
  }
}
