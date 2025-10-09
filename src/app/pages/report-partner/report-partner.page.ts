import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownDrawerComponent } from 'src/app/components/dropdown-drawer/dropdown-drawer.component';
import { FloatingMenuComponent } from 'src/app/components/floating-menu/floating-menu.component';
import { IonicModule } from '@ionic/angular';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-partner',
  templateUrl: './report-partner.page.html',
  styleUrls: ['./report-partner.page.css'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, DropdownDrawerComponent, FloatingMenuComponent]
})
export class ReportPartnerPage implements OnInit {

  profileImageUrl: any;
  userId: number | null = null;

  constructor(
    private location: Location,
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
    this.profileImageUrl = user?.profileImage ?? null;
    // Normalise l'identifiant utilisateur
    this.userId = user?.id ?? user?.userId ?? null;

    if (!this.userId) {
      console.warn('Identifiant utilisateur introuvable.');
      return;
    }

  }

  goBack() {
    this.location.back();
  }

}
