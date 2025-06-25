import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.page.html',
  styleUrls: ['./suggestion.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class SuggestionPage implements OnInit {

  stories = [
    {name: 'Christie B.', img: 'assets/img/myLOve/story/story01.png' },
    {name: 'Mrs. Rodolfo', img: 'assets/img/myLOve/story/story02.png' },
    {name: 'Eloise Legrand', img: 'assets/img/myLOve/story/story03.png' },
    {name: 'Ahmed S.', img: 'assets/img/myLOve/story/story02.png' }
  ];

  suggestions = [
    {
      role: 'Beautician',
      name: 'Miss Zachary Will',
      description: 'Doloribus saepe aut necessitat qui non qui.',
      note: '4.9',
      bg: 'assets/img/myLOve/story/story03.png'
    },
    {
      role: 'Beautician',
      name: 'Miss Zachary Will',
      description: 'Doloribus saepe aut necessitat qui non qui.',
      note: '4.9',
      bg: 'assets/img/myLOve/story/story03.png'
    },
    {
      role: 'Beautician',
      name: 'Miss Zachary Will',
      description: 'Doloribus saepe aut necessitat qui non qui.',
      note: '4.9',
      bg: 'assets/img/myLOve/story/story03.png'
    }
  ]

  constructor() { }

  ngOnInit() {
  }

}
