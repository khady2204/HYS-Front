import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';


// Représente une requête d'envoi de message
export interface MessageRequest {
  receiverId: number;
  content: string;
}

//  Représente la réponse du serveur après l'envoi ou la récupération d'un message
export interface MessageResponse {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
  read: true | false;             // Indique si le message a été lu
  mediaUrl?: string;              // URL d'un média joint (image, vidéo, audio)
  mediaType?: string;             // Type du média (image, vidéo, audio)
  audioDuration?: number;         // Durée du message vocal 
  isSender?: boolean;             // Déterminé côté frontend pour savoir si le message a été envoyé par l'utilisateur courant
}

// Représente un utilisateur résumé dans une discussion
export interface UserSummary {
  id: number;
  prenom: string;
  nom: string;
  profileImage?: string;
  phone: string;
}

// Représente une discussion entre l'utilisateur connecté et un autre utilisateur
export interface DiscussionResponse {
  ami: UserSummary;                 // L'utilisateur avec qui on échange
  messages: MessageResponse[];     // Dernier message (ou tous selon implémentation)
  unreadCount?: number;            // Nombre de messages non lus dans la conversation
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private readonly baseUrl = 'http://localhost:8081/api/messages';

  constructor(private http: HttpClient) {}

  /**
   * 🚀 Envoie un message au backend (supporte fichiers via FormData).
   * Peut contenir un texte simple, une image, une vidéo ou un audio.
   * @param formData Données multipart contenant receiverId, content et éventuellement mediaFile.
   */
  sendMessage(formData: FormData): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.baseUrl}`, formData);
  }

  /**
   * Récupère tous les messages entre l'utilisateur connecté et un autre utilisateur.
   * @param userId ID de l'utilisateur avec qui on discute
   */
  getMessageWithUser(userId: number): Observable<MessageResponse[]> {
    return this.http.get<MessageResponse[]>(`${this.baseUrl}/${userId}`)
  }

  /**
   * Récupère toutes les discussions actives de l'utilisateur courant.
   * Chaque discussion contient les infos de l'ami et le dernier message échangé.
   */
  getAllDiscussions(): Observable<DiscussionResponse[]> {
    return this.http.get<DiscussionResponse[]>(`${this.baseUrl}/discussions`);
  }

  /**
   * Marque un message spécifique comme "lu".
   * Cette action mettra à jour le champ `read = true` côté serveur.
   * @param messageId ID du message à marquer
   */
  markMessageAsRead(messageId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${messageId}/read`, {});
  }


  /**
   * Recherche des discussions existantes en filtrant par prénom, nom ou téléphone.
   * Utile pour une barre de recherche dans la messagerie.
   * @param params Filtres possibles : phone, nom ou prénom
   */
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
