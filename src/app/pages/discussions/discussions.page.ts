import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { FloatingMenuComponent } from 'src/app/components/floating-menu/floating-menu.component';
import { DropdownDrawerComponent } from 'src/app/components/dropdown-drawer/dropdown-drawer.component';

@Component({
  selector: 'app-discussions',
  templateUrl: './discussions.page.html',
  styleUrls: ['./discussions.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, RouterLink, FloatingMenuComponent, DropdownDrawerComponent]
})
export class DiscussionsPage implements OnInit {

  showDrawer = false;
  discussions = [
    { id: 1, name: 'Fatou Ly', photo: 'assets/img/myLOve/suggestion/user1.png', unread: 3, online: true },
    { id: 2, name: 'Hawa Sow', photo: 'assets/img/myLOve/suggestion/user2.png', unread: 4, online: false },
    { id: 3, name: 'Aicha Ndiaye', photo: 'assets/img/myLOve/suggestion/user3.png', unread: 0, online: true },
    { id: 4, name: 'Salma Fall', photo: 'assets/img/myLOve/suggestion/user4.png', unread: 0, online: false },
    { id: 5, name: 'Astou Diop', photo: 'assets/img/myLOve/suggestion/user5.png', unread: 0, online: true },
  ];

  constructor() { }

  ngOnInit() {
  }

  toggleDrawer() {
  this.showDrawer = !this.showDrawer;
}



}
