import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { notifications } from 'ionicons/icons';

export interface NotificationDTO {
  id: number;
  message: string;
  lue: boolean;
  dateEnvoi: string;
  type: string;
  emetteurNomComplet: string;
  photoProfilEmetteur: string | null;
  cibleUrl: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  //private apiUrl = 'http://localhost:8081/api/notifications';

  private readonly apiUrl = `${environment.apiBase}/api/notifications`;

  // Pour mise à jour en direct
  private notificationsSubject = new BehaviorSubject<NotificationDTO[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Rafraichir la liste des notifications
  refreshNotifications(): void {
    this.getNotifications().subscribe({
      next: (data) => this.notificationsSubject.next(data),
      error: (err) => console.error('Erreur de chargement des notifications', err)
    });
  }

  // Récupérer toutes les notifications
  getNotifications(): Observable<NotificationDTO[]> {
    return this.http.get<NotificationDTO[]>(this.apiUrl);
  }

  // Récupérer uniquement les notifications non lues
  getNonLues(): Observable<NotificationDTO[]> {
    return this.http.get<NotificationDTO[]>(`${this.apiUrl}/non-lues`);
  }

  // Marquer une notification comme lue
  marquerCommeLue(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/lue`, {});
  }

  // Lire directement une notification et obtenir son contenu (message, commentaire…)
  lireNotification(id: number): Observable<NotificationDTO> {
    return this.http.get<NotificationDTO>(`${this.apiUrl}/${id}/lire`);
  }
}
