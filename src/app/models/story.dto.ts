export interface StoryDto {
  id: number;
  userId: number;
  userFullName: string;
  userProfileImage: string | null;
  text: string | null;
  mediaUrls: string[];
  createdAt: string; // ISO date
  expiresAt: string; // ISO date
  timeLeftInHours: number;
}

export interface CreateStoryTextRequest {
  text: string;
}

export type CreateStoryMediaRequest = {
  files: File[];
  description?: string | null;
};

// Interface pour les stories groupées par utilisateur
export interface UserStories {
  userId: number;
  userFullName: string;
  userProfileImage: string | null;
  stories: StoryDto[];
  hasUnreadStories: boolean;
  totalStories: number;
}


