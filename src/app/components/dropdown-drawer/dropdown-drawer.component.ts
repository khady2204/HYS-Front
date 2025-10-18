import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropdown-drawer',
  templateUrl: './dropdown-drawer.component.html',
  styleUrls: ['./dropdown-drawer.component.css'],
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
      href: '/construction',
      icon: 'bi-book',
      bgColor: 'bg-primary'
    },
    {
      label: 'Banque',
      href: '/construction',
      icon: 'bi-bank',
      bgColor: 'bg-success'
    },
    {
      label: 'Santé',
      href: '/construction',
      icon: 'bi-heart-pulse',
      bgColor: 'bg-danger'
    },
    {
      label: 'Voyage',
      href: '/construction',
      icon: 'bi-airplane-engines',
      bgColor: 'bg-info'
    },
    {
      label: 'Islamique',
      href: '/construction',
      icon: 'bi-moon-stars',
      bgColor: 'bg-warning'
    }
  ];

 ngOnInit(): void {

 }

}
