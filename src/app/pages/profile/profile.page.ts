import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { CustomToastService } from 'src/app/services/toast/custom-toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.css'],
  standalone: true,
  imports: [IonicModule, RouterLink, CommonModule, FormsModule, RouterLink, FloatingMenuComponent, ReactiveFormsModule]
})
export class ProfilePage implements OnInit, OnDestroy {

  private userSub!: Subscription
  prenom: string = '';
  nom: string = '';
  profileImageUrl: any;
  adresse: string = '';
  bio: string ='';
  dob: string = '';
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
    private toastController: ToastController,
    private customToast: CustomToastService
  ) { }

  ngOnInit() {
    if (!this.userAuthService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    const userId = Number(this.route.snapshot.paramMap.get('id'));

    //  S'abonner aux changements de l'utilisateur
    this.userSub = this.userAuthService.user$.subscribe((user) => {
      if (user && user.id === userId) {
        this.userId = user.id;
        this.prenom = user.prenom;
        this.nom = user.nom;
        this.profileImageUrl = this.urlUtils.buildProfileImageUrl(user.profileImage) + '?v=' + Date.now(); // évite le cache
        this.adresse = user.adresse ?? 'Non renseignée';
        this.bio = user.bio;
        this.dob = user.dateNaissance;
        console.log('Profil à jour :', user);
      }
    });
  }

  ngOnDestroy(): void {
      if (this.userSub) this.userSub.unsubscribe();
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
    this.authService.logout().subscribe({
      next: () => {

        // Suppression du token
        localStorage.removeItem('jwtToken');

        // Fermer le modal
        this.showLogoutModal = false;

        // Afficher le toast
        this.customToast.show('Vous etes deconnecté', 'success');

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


}
