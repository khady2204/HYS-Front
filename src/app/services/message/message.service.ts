import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Interface pour le corps d'une requete d'envoi de message
export interface MessageRequest {
   receiverId: number,
  content: string;
}

// Interface pour la réponse d'un message
export interface MessageResponse {
  id: number,
  senderId: number,
  recipientId: number,
  content: string,
  timestamp: string;
  isSender?: boolean; // Indique si le message a été envoyé par l'utilisateur connecté
}

// Interface pour résumer un utilisateur dans une discussion
export interface UserSummary {
  id: number;
  prenom: string;
  nom: string;
  profileImage?: string;
  phone: string;
}

// Interface représentant une discussion complete entre deux utilisateurs
export interface DiscussionResponse {
  ami: UserSummary;
  messages: MessageResponse[];
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private baseUrl = 'http://localhost:8081/api/messages';

  constructor(private http: HttpClient) { }
  
  // Envoi d'un message
  sendMessage(request: MessageRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.baseUrl}`, request)
  }

  // Récupération des messages d'une discussion
  getMessageWithUser(userId: number): Observable<MessageResponse[]> {
    return this.http.get<MessageResponse[]>(`${this.baseUrl}/${userId}`);
  }

  // Récupération de toutes les discussions de l'utilisateur connecté
  getAllDiscussions(): Observable<DiscussionResponse[]> {
    return this.http.get<DiscussionResponse[]>(`${this.baseUrl}/discussions`);
  }

  // Rechercher une discussion en utilisant un numéro de téléphone ou un prénom/nom
  searchDiscussion(params: { phone?: string; nom?: string; prenom?: string}): Observable<DiscussionResponse[]> {
    let httpParams = new HttpParams();

    if (params.phone) httpParams = httpParams.set('phone', params.phone);
    if (params.nom) httpParams = httpParams.set('nom', params.nom);
    if (params.prenom) httpParams = httpParams.set('prenom', params.prenom);

    return this.http.get<DiscussionResponse[]>(`${this.baseUrl}/discussions/search`, { params: httpParams });
  }
}
