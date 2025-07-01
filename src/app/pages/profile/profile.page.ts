import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonContent, CommonModule, FormsModule]
})
export class ProfilePage implements OnInit {

  photos = [
    'assets/img/myLOve/profile/profile1.png',
    'assets/img/myLOve/profile/profile2.png',
    'assets/img/myLOve/profile/profile3.png',
    'assets/img/myLOve/profile/profile1.png',
    'assets/img/myLOve/profile/profile2.png',
    'assets/img/myLOve/profile/profile3.png',   
  ];

  constructor() { }

  ngOnInit() {
  }

}
