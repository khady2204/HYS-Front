import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-validationsms',
  templateUrl: './validationsms.page.html',
  styleUrls: ['./validationsms.page.scss'],
  standalone: true,
  imports: [ IonicModule , CommonModule, FormsModule]
})
export class ValidationsmsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
