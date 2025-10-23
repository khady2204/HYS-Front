
export interface NotificationDTO {
  id: number;
  message: string;
  lue: boolean;
  dateEnvoi: string | null;
  type: 'MESSAGE' | 'SUGGESTION' | 'LIKE' | 'COMMENTAIRE' | 'MISE_A_JOUR_PUBLICATION';
  emetteurNomComplet: string;
  photoProfilEmetteur: string | null;
  cibleUrl: string | null;
}
