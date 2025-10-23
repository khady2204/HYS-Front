import { Component, OnInit } from '@angular/core';
import { NotificationService, NotificationDTO } from '../services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  standalone: true,
  imports: [ CommonModule]
})
export class NotificationsComponent implements OnInit {
  notifications: NotificationDTO[] = [];

  constructor(private notifService: NotificationService) {}

  ngOnInit(): void {
    this.chargerNotifications();
  }

  chargerNotifications() {
    this.notifService.getNotifications().subscribe(data => {
      this.notifications = data;
      console.log("notification chargées :", this.notifications)
    });
  }

  ouvrirNotification(notif: NotificationDTO) {
    if (!notif.lue) {
      this.notifService.marquerCommeLue(notif.id).subscribe(() => {
        notif.lue = true;
      });
    }

    if (notif.cibleUrl) {
      window.location.href = notif.cibleUrl;
    }
  }
}
