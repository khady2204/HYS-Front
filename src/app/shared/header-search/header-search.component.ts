import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FiltreServiceComponent } from 'src/app/components/filtre-service/filtre-service.component';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UserService } from 'src/app/services/user.service';
import { IonHeader, IonContent } from "@ionic/angular/standalone";
import { IonicModule } from "@ionic/angular";

@Component({
  selector: 'app-header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.css'],
  imports: [IonContent, IonHeader, RouterLink, FiltreServiceComponent, IonicModule],
  standalone: true
})
export class HeaderSearchComponent  implements OnInit {

  userId: number | null = null;
  profileImageUrl: any;
  filterOpen = false;

  constructor(
    private userAuthService: UserAuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // Vérifie s'il est connecté
    if (!this.userAuthService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    const user = this.userAuthService.getUser();
    this.userId = user?.id ?? null;
    this.profileImageUrl = user?.profileImage ?? null;
  }


  toggleFilter() {
  this.filterOpen = !this.filterOpen;
}

}
