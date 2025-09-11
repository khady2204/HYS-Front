import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * Représente la requête pour envoyer un message texte ou média.
 */
export interface MessageRequest {
  receiverId: number;   // ID de l'utilisateur destinataire
  content: string;      // Contenu texte du message
}

/**
 * Représente la réponse du serveur pour un message.
 */
export interface MessageResponse {
  id: number;           // ID unique du message
  senderId: number;     // ID de l'expéditeur
  receiverId: number;   // ID du destinataire
  content: string;      // Contenu texte du message
  timestamp: string;    // Date/heure d'envoi
  read: boolean;        // Indique si le message a été lu
  mediaUrl: string | null;   // URL d'un média joint (image, vidéo, audio)
  mediaType: string | null;  // Type du média ('image', 'video', 'audio')
  audioDuration: number;     // Durée d'un message audio (en secondes)
  isSender: boolean;         // Déterminé côté frontend : true si l'utilisateur courant est l'expéditeur
}

/**
 * Représente un utilisateur résumé dans une discussion.
 */
export interface UserSummary {
  id: number;                   // ID unique de l'utilisateur
  prenom: string;               // Prénom
  nom: string;                  // Nom
  profileImage?: string;        // URL image de profil (optionnel)
  phone: string;                // Numéro de téléphone
  online?: boolean;
}

/**
 * Représente une discussion entre l'utilisateur courant et un ami.
 */
export interface DiscussionResponse {
  ami: UserSummary;            // Infos de l'utilisateur avec qui on discute
  messages: MessageResponse[]; // Historique des messages
  unreadCount?: number;        // Nombre de messages non lus
}

/**
 * Service de gestion des messages.
 * Fournit des méthodes pour :
 * - Envoyer des messages texte ou média
 * - Récupérer les messages avec un utilisateur
 * - Récupérer les discussions
 * - Marquer un message comme lu
 * - Rechercher des discussions
 */
@Injectable({
  providedIn: 'root'
})
export class MessageService {

  
  /** URL de base de l'API messages */

  private baseUrl = environment.apiBase ;

  constructor(private http: HttpClient) {}

  /**
   * Envoie un message texte ou média.
   * @param formData Données multipart : receiverId, content, mediaFile, mediaType, audioDuration
   * @returns Observable<MessageResponse> contenant le message envoyé avec les champs normalisés
   */
  sendMessage(formData: FormData): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.baseUrl}/api/messages`, formData)
      .pipe(
        map(msg => this.mapMessage(msg))
      );
  }

  /**
   * Récupère tous les messages échangés avec un utilisateur spécifique.
   * @param userId ID de l'utilisateur cible
   * @param currentUserId ID de l'utilisateur courant (pour calculer isSender)
   * @returns Observable<MessageResponse[]> avec les messages normalisés
   */
  getMessageWithUser(userId: number, currentUserId?: number): Observable<MessageResponse[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/messages/${userId}`).pipe(
      map(messages => messages.map(msg => this.mapMessage(msg, currentUserId)))
    );
  }

  /**
   * Récupère toutes les discussions de l'utilisateur courant.
   * @param currentUserId ID de l'utilisateur courant
   * @returns Observable<DiscussionResponse[]> contenant toutes les discussions avec les messages normalisés
   */
  getAllDiscussions(currentUserId?: number): Observable<DiscussionResponse[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/messages/discussions`).pipe(
      map(discussions => discussions.map(d => ({
        ami: {
          id: d.ami.id,
          prenom: d.ami.prenom,
          nom: d.ami.nom,
          profileImage: d.ami.profileImage || d.ami.profile_image,
          phone: d.ami.phone
        },
        messages: d.messages.map((msg: any) => this.mapMessage(msg, currentUserId)),
        unreadCount: d.unreadCount
      })))
    );
  }

  /**
   * Marque un message comme lu côté serveur.
   * @param messageId ID du message à marquer
   * @returns Observable<void>
   */
  markMessageAsRead(messageId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/api/messages/${messageId}/read`, {});
  }

  /**
   * Recherche des discussions en fonction de paramètres filtrés.
   * @param params Critères de recherche : phone, nom, prenom
   * @param currentUserId ID de l'utilisateur courant pour déterminer isSender
   * @returns Observable<DiscussionResponse[]> avec les discussions filtrées
   */
  searchDiscussion(params: { phone?: string; nom?: string; prenom?: string }, currentUserId?: number): Observable<DiscussionResponse[]> {
    const httpParams = new HttpParams({
      fromObject: {
        ...(params.phone && { phone: params.phone }),
        ...(params.nom && { nom: params.nom }),
        ...(params.prenom && { prenom: params.prenom })
      }
    });

    return this.http.get<any[]>(`${this.baseUrl}/api/messages/discussions/search`, { params: httpParams }).pipe(
      map(discussions => discussions.map(d => ({
        ami: {
          id: d.ami.id,
          prenom: d.ami.prenom,
          nom: d.ami.nom,
          profileImage: d.ami.profileImage || d.ami.profile_image,
          phone: d.ami.phone
        },
        messages: d.messages.map((msg: any) => this.mapMessage(msg, currentUserId)),
        unreadCount: d.unreadCount
      })))
    );
  }

  /**
   * Normalise un message provenant du backend pour uniformiser les champs.
   * @param msg Message brut reçu de l'API
   * @param currentUserId ID de l'utilisateur courant pour calculer isSender
   * @returns MessageResponse avec tous les champs correctement mappés
   */
  private mapMessage(msg: any, currentUserId?: number): MessageResponse {
    const senderId = msg.senderId ?? msg.sender_id;
    const receiverId = msg.receiverId ?? msg.receiver_id;

    return {
      id: msg.id,
      senderId,
      receiverId,
      content: msg.content ?? '',
      timestamp: msg.timestamp,
      read: msg.read ?? false,
      mediaUrl: msg.mediaUrl ?? msg.media_url ?? null,
      mediaType: msg.mediaType ?? msg.media_type ?? null,
      audioDuration: msg.audioDuration ?? msg.audio_duration ?? 0,
      isSender: currentUserId != null ? senderId === currentUserId : false
    };
  }
}
