import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FiltreServiceComponent } from 'src/app/components/filtre-service/filtre-service.component';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.scss'],
  imports: [RouterLink, FiltreServiceComponent],
  standalone: true
})
export class HeaderSearchComponent  implements OnInit {

  userId: number | null = null;
  profileImageUrl: any;

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

  

}
