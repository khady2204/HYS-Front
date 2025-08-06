import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// 📨 Requête d'envoi de message
export interface MessageRequest {
  receiverId: number;
  content: string;
}

// 📩 Réponse de message
export interface MessageResponse {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
  read: true | false;
  mediaUrl?: string;
  mediaType?: string;
  audioDuration?: number;
  isSender?: boolean; // Champ local côté frontend
}

// 👤 Résumé utilisateur dans une discussion
export interface UserSummary {
  id: number;
  prenom: string;
  nom: string;
  profileImage?: string;
  phone: string;
}

// 🗨️ Représentation d'une discussion
export interface DiscussionResponse {
  ami: UserSummary;
  messages: MessageResponse[];
  unreadCount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private readonly baseUrl = 'http://localhost:8081/api/messages';

  constructor(private http: HttpClient) {}

  // 🚀 Envoi d'un message (support FormData pour médias)
  sendMessage(formData: FormData): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.baseUrl}`, formData);
  }

  // 📥 Récupère les messages avec un utilisateur donné
  getMessageWithUser(userId: number): Observable<MessageResponse[]> {
    return this.http.get<MessageResponse[]>(`${this.baseUrl}/${userId}`);
  }

  // 🧵 Récupère toutes les discussions
  getAllDiscussions(): Observable<DiscussionResponse[]> {
    return this.http.get<DiscussionResponse[]>(`${this.baseUrl}/discussions`);
  }

  // ✔️ Marque un message comme lu
  markMessageAsRead(messageId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${messageId}/read`, {});
  }

  // 🔍 Recherche une discussion par prénom, nom ou téléphone
  searchDiscussion(params: { phone?: string; nom?: string; prenom?: string }): Observable<DiscussionResponse[]> {
    const httpParams = new HttpParams({
      fromObject: {
        ...(params.phone && { phone: params.phone }),
        ...(params.nom && { nom: params.nom }),
        ...(params.prenom && { prenom: params.prenom })
      }
    });

    return this.http.get<DiscussionResponse[]>(`${this.baseUrl}/discussions/search`, { params: httpParams });
  }
}
