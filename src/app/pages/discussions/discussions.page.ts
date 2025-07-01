import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-discussions',
  templateUrl: './discussions.page.html',
  styleUrls: ['./discussions.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class DiscussionsPage implements OnInit {

  discussions = [
   { name: 'Fatou Ly', photo: 'assets/img/myLOve/suggestion/user1.png', unread: 3, online: true },
   { name: 'Hawa Sow', photo: 'assets/img/myLOve/suggestion/user2.png', unread: 4, online: false },
   { name: 'Aicha Ndiaye', photo: 'assets/img/myLOve/suggestion/user3.png', unread: 0, online: true },
   { name: 'Salma Fall', photo: 'assets/img/myLOve/suggestion/user4.png', unread: 0, online: false },
   { name: 'Astou Diop', photo: 'assets/img/myLOve/suggestion/user5.png', unread: 0, online: true },
  ];

  constructor() { }

  ngOnInit() {
  }

}
