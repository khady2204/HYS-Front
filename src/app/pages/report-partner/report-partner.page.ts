import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownDrawerComponent } from 'src/app/components/dropdown-drawer/dropdown-drawer.component';
import { FloatingMenuComponent } from 'src/app/components/floating-menu/floating-menu.component';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-report-partner',
  templateUrl: './report-partner.page.html',
  styleUrls: ['./report-partner.page.css'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, DropdownDrawerComponent, FloatingMenuComponent]
})
export class ReportPartnerPage implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }

}
