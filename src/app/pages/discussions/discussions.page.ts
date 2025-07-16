import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonList, IonHeader, IonTitle, IonToolbar, IonAvatar, IonItem, IonLabel, IonBadge, IonItemSliding, IonItemOptions, IonItemOption, IonIcon } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { FloatingMenuComponent } from 'src/app/components/floating-menu/floating-menu.component';
import { DropdownDrawerComponent } from 'src/app/components/dropdown-drawer/dropdown-drawer.component';

@Component({
  selector: 'app-discussions',
  templateUrl: './discussions.page.html',
  styleUrls: ['./discussions.page.scss'],
  standalone: true,
  imports: [IonList, IonItem, IonItemSliding, IonItemOptions, IonAvatar, IonLabel, IonItemOption, IonBadge, IonContent, CommonModule, FormsModule, RouterLink, FloatingMenuComponent, DropdownDrawerComponent]
})
export class DiscussionsPage implements OnInit {

  showDrawer = false;
  discussions = [
    { id: 1, name: 'Fatou Ly', photo: 'assets/img/myLOve/suggestion/user1.png', unread: 3, online: true },
    { id: 2, name: 'Hawa Sow', photo: 'assets/img/myLOve/suggestion/user2.png', unread: 4, online: false },
    { id: 3, name: 'Aicha Ndiaye', photo: 'assets/img/myLOve/suggestion/user3.png', unread: 0, online: true },
    { id: 4, name: 'Salma Fall', photo: 'assets/img/myLOve/suggestion/user4.png', unread: 0, online: false},
    { id: 5, name: 'Astou Diop', photo: 'assets/img/myLOve/suggestion/user5.png', unread: 0, online: true },
  ];


  constructor(private router: Router) { }

  ngOnInit() {
  }

  toggleDrawer() {
  this.showDrawer = !this.showDrawer;
}

supprimer(user: any) {
  this.discussions = this.discussions.filter(u => u.id !== user.id);
}

navigateToChat(user: any) {
  this.router.navigate(['/chat'], { queryParams: { userId: user.id } });
}

}
