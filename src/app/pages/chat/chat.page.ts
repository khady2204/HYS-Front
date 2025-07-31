import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class ChatPage implements OnInit {

  user: any;

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.user = navigation?.extras?.state?.['user'];
  
    if (!this.user) {
      // Fallback si rechargement ou accès direct
      const id = this.route.snapshot.paramMap.get('userId');

      console.warn('Pas de données utilisateur dans l\'état de navigation, tentative de récupération par ID:', id);
    }
  
  }

  goBack() {
    this.location.back();
  }

}
