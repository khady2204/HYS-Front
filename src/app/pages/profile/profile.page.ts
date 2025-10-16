import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FloatingMenuComponent } from 'src/app/components/floating-menu/floating-menu.component';
import { UserService } from 'src/app/services/user.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { IonicModule } from '@ionic/angular';
import { UrlUtilsService } from 'src/app/services/url-utils.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.css'],
  standalone: true,
  imports: [IonicModule, RouterLink, CommonModule, FormsModule, RouterLink, FloatingMenuComponent, ReactiveFormsModule]
})
export class ProfilePage implements OnInit {

  prenom: string = '';
  nom: string = '';
  profileImageUrl: any;
  adresse: string = '';
  bio: string ='';
  userId: number = 0;

  showMenu = false;
  showLogoutModal = false; // controle la visibilité du bouton

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private userAuthService: UserAuthService,
    private urlUtils: UrlUtilsService,
    private authService: AuthService,
    private toastController: ToastController
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
      this.profileImageUrl = this.urlUtils.buildProfileImageUrl(user.profileImage);
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

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  // Ouvrir le modal
  openLogoutModal() {
    this.showLogoutModal = true;
    this.showMenu = false;
  }

  // Fermer le modal
  closeLogoutModal() {
    this.showLogoutModal = false;
  }

 // Méthode de déconnexion
logout() {
  console.log('Déconnexion initiée');
  this.authService.logout().subscribe({
    next: () => {
      console.log('Réponse du serveur reçue');

      // Suppression du token
      localStorage.removeItem('jwtToken');
      console.log('Token supprimé');

      // Fermer le modal
      this.showLogoutModal = false;
      console.log('Modal fermé');

      // Afficher le toast
      this.presentLogoutToast();
      console.log('Toast affiché (non await)');

      // Navigation après un petit délai
      setTimeout(() => {
        console.log('Navigation vers /home');
        this.router.navigate(['/home']);
      }, 500);
    },
    error: (err) => {
      console.error('Erreur lors de la déconnexion', err);
      this.showLogoutModal = false;
    }
  });
}

async presentLogoutToast() {
  const toast = await this.toastController.create({
    message: 'Vous êtes déconnecté(e)',
    duration: 2000,
    color: 'success',
    position: 'top'
  });
  toast.present();
}


}
