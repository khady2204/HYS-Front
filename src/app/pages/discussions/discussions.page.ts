import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonList, IonHeader, IonTitle, IonToolbar, IonAvatar, IonItem, IonLabel, IonBadge, IonItemSliding, IonItemOptions, IonItemOption, IonIcon } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { FloatingMenuComponent } from 'src/app/components/floating-menu/floating-menu.component';
import { DropdownDrawerComponent } from 'src/app/components/dropdown-drawer/dropdown-drawer.component';
import { DiscussionResponse, MessageService } from 'src/app/services/message/message.service';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-discussions',
  templateUrl: './discussions.page.html',
  styleUrls: ['./discussions.page.scss'],
  standalone: true,
  imports: [IonList, IonItem, IonItemSliding, IonItemOptions, IonAvatar, IonLabel, IonItemOption, IonBadge, IonContent, CommonModule, FormsModule, RouterLink, FloatingMenuComponent, DropdownDrawerComponent]
})
export class DiscussionsPage implements OnInit {

  showDrawer = false;
  discussions: DiscussionResponse[] = [];
  currentUserId: number = 0;
  userId: number | null = null;


  constructor(
    private router: Router,
    private messageService: MessageService,
    private userService: UserAuthService
  ) { }

  ngOnInit() {

    // Vérifie s'il est connecté
    if (!this.userService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    const user = this.userService.getUser();
    this.userId = user?.id ?? null;

    this.currentUserId = this.userService.getUserId() ?? 0;
    this.loadDiscussions();
  }

  loadDiscussions() {
    this.messageService.getAllDiscussions().subscribe({
      next: (data) => {
        this.discussions = data;
        console.log('Discussions chargées avec succès', this.discussions);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des discussions', err);
      }
    })
  }

  toggleDrawer() {
  this.showDrawer = !this.showDrawer;
}

supprimer(user: any) {
  this.discussions = this.discussions.filter(u => u.ami.id !== user.user.id);
} 

navigateToChat(userId: number) {
  const discussion = this.discussions.find(d => d.ami.id === userId);
  this.router.navigate(['/chat', userId], {
    state: { 
      user: discussion?.ami,
      messages: discussion?.messages
    }
  });
}



}
