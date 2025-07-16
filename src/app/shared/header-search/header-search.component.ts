import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FiltreServiceComponent } from 'src/app/components/filtre-service/filtre-service.component';

@Component({
  selector: 'app-header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.scss'],
  imports: [RouterLink, FiltreServiceComponent],
  standalone: true
})
export class HeaderSearchComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  

}
