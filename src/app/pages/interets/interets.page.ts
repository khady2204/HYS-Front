import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonButton,
  IonText,
  IonRow,
  IonCol,
  ToastController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { UserAuthService } from 'src/app/services/user-auth.service';
import { InteretService } from 'src/app/services/interet/interet.service';

@Component({
  selector: 'app-interets',
  templateUrl: './interets.page.html',
  styleUrls: ['./interets.page.css'],
  standalone: true,
  imports: [
    IonCol,
    IonRow,
    IonText,
    IonButton,
    IonCheckbox,
    IonLabel,
    IonItem,
    IonList,
    IonContent,
    CommonModule,
    FormsModule
  ]
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
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      console.warn("Utilisateur non authentifié.");
      this.router.navigate(['/login']);
      return;
    }

    const id = this.userAuthService.getId();
    this.userId = id ? Number(id) : null;

    this.interetService.getAllInterets().subscribe({
      next: (interets: any[]) => {
        this.interets = interets.map((i: any) => ({ id: i.id, nom: i.nom }));
        const middle = Math.ceil(this.interets.length / 2);
        this.leftColumn = this.interets.slice(0, middle);
        this.rightColumn = this.interets.slice(middle);
        console.log(" Intérêts chargés :", this.interets);
      },
      error: (err) => {
        console.error(" Erreur lors du chargement des intérêts :", err);
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

    if (!this.selectedInterets || this.selectedInterets.length === 0) {
      this.showToast("Veuillez sélectionner au moins un centre d'intérêt", 'danger');
      return;
    }

    const payload = {
      userId: this.userId,
      interetIds: this.selectedInterets
    };

    console.log(" Payload envoyé :", payload);

    this.interetService.createUserInteret(payload).subscribe({
      next: () => {
        this.showToast("Choix enregistré avec succès !", 'success');
        this.router.navigate(['/suggestion']);
      },
      error: (err) => {
        console.error(" Erreur lors de l'envoi des intérêts :", err);
        this.showToast("Erreur lors de l'envoi des centres d'intérêt. Veuillez réessayer.", 'danger');
      }
    });
  }

  async showToast(message: string, color: 'success' | 'danger' = 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color
    });
    toast.present();
  }
}
