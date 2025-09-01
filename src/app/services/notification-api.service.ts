// src/app/services/notification-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationDTO } from '../models/notification.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationApiService {
  constructor(private http: HttpClient) {}

  list(baseUrl: string): Observable<NotificationDTO[]> {
    return this.http.get<NotificationDTO[]>(`${baseUrl}/api/notifications`);
  }

  unread(baseUrl: string): Observable<NotificationDTO[]> {
    return this.http.get<NotificationDTO[]>(`${baseUrl}/api/notifications/non-lues`);
  }

  markRead(baseUrl: string, id: number): Observable<void> {
    return this.http.post<void>(`${baseUrl}/api/notifications/${id}/lue`, {});
  }
  
}
