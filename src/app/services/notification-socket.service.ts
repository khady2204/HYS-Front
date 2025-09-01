import { Injectable, NgZone } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject, Observable } from 'rxjs';


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

@Injectable({ providedIn: 'root' })
export class NotificationSocketService {
  private client?: Client;
  private subscription?: StompSubscription;
  private stream$ = new Subject<NotificationDTO>();

  constructor(private zone: NgZone) {}

  connect(userId: number, jwt?: string) {
    if (this.client?.connected) return;

    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8081/ws-notifications'),
      reconnectDelay: 3000, // auto-retry
      // Si tu protèges STOMP avec JWT, tu peux passer le header ici
      connectHeaders: jwt ? { Authorization: `Bearer ${jwt}` } : {},
      debug: () => {} // désactive le spam console
    });

    this.client.onConnect = () => {
      // s’abonner au topic dédié à l’utilisateur
      this.subscription = this.client!.subscribe(
        `/topic/notifications/${userId}`,
        (message: IMessage) => {
          this.zone.run(() => {
            const payload: NotificationDTO = JSON.parse(message.body);
            this.stream$.next(payload);
          });
        }
      );
    };

    this.client.activate();
  }

  disconnect() {
    this.subscription?.unsubscribe();
    this.client?.deactivate();
    this.subscription = undefined;
    this.client = undefined;
  }

  onNotification(): Observable<NotificationDTO> {
    return this.stream$.asObservable();
  }
}
