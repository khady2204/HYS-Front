import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropdown-drawer',
  templateUrl: './dropdown-drawer.component.html',
  styleUrls: ['./dropdown-drawer.component.scss'],
  imports: [CommonModule]
})
export class DropdownDrawerComponent  implements OnInit {

 showDrawer = false;

  toggleDrawer() {
    this.showDrawer = !this.showDrawer;
  }

  drawerLinks = [
    {
      label: 'Éducation',
      href: '/education',
      icon: 'bi-book',
      bgColor: 'bg-primary'
    },
    {
      label: 'Banque',
      href: '/banque',
      icon: 'bi-bank',
      bgColor: 'bg-success'
    },
    {
      label: 'Santé',
      href: '/sante',
      icon: 'bi-heart-pulse',
      bgColor: 'bg-danger'
    },
    {
      label: 'Voyage',
      href: '/voyage',
      icon: 'bi-airplane-engines',
      bgColor: 'bg-info'
    },
    {
      label: 'Islamique',
      href: '/islamique',
      icon: 'bi-moon-stars',
      bgColor: 'bg-warning'
    }
  ];

 ngOnInit(): void {
   
 } 

}
