import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { FloatingMenuComponent } from 'src/app/components/floating-menu/floating-menu.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, CommonModule, FormsModule, RouterLink, FloatingMenuComponent]
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
