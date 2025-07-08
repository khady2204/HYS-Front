import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.scss'],
  imports: [RouterLink],
  standalone: true
})
export class HeaderSearchComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
