import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { DropdownDrawerComponent } from 'src/app/components/dropdown-drawer/dropdown-drawer.component';

@Component({
  selector: 'app-report-partner',
  templateUrl: './report-partner.page.html',
  styleUrls: ['./report-partner.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, DropdownDrawerComponent]
})
export class ReportPartnerPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
