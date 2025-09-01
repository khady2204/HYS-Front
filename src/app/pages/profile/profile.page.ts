import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FloatingMenuComponent } from 'src/app/components/floating-menu/floating-menu.component';
import { UserService } from 'src/app/services/user.service';
import { UserAuthService } from 'src/app/services/user-auth.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.css'],
  standalone: true,
  imports: [IonButton, IonContent, RouterLink, CommonModule, FormsModule, RouterLink, FloatingMenuComponent, ReactiveFormsModule]
})
export class ProfilePage implements OnInit {

  prenom: string = '';
  nom: string = '';
  adresse: string = '';
  bio: string ='';
  userId: number = 0;

  photos = [
    'assets/img/myLOve/profile/profile1.png',
    'assets/img/myLOve/profile/profile2.png',
    'assets/img/myLOve/profile/profile3.png',
    'assets/img/myLOve/profile/profile1.png',
    'assets/img/myLOve/profile/profile2.png',
    'assets/img/myLOve/profile/profile3.png',   
  ];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private userAuthService: UserAuthService
  ) { }

  ngOnInit() {
    
    if (!this.userAuthService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    const userId = Number(this.route.snapshot.paramMap.get('id'));
    const user = this.userAuthService.getUser();

    if (user && user.id === userId) {
      this.userId = user.id;
      this.prenom = user.prenom;
      this.nom = user.nom;
      this.adresse = user.adresse ?? 'Non renseignée';
      this.bio = user.bio;
      console.log("Profil chargé :", user);
    } else {
      console.warn("L'utilisateur dans l'url ne corresponde pas à l'utilisateur actuel.");
    }

  }
 
  goBack() {
    this.location.back();
  }

}
