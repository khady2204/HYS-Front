import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryDto, UserStories } from '../../models/story.dto';
import { StoryService } from '../../services/story/story.service';

@Component({
  selector: 'app-story-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="story-viewer-overlay" (click)="closeViewer()">
      <div class="story-viewer-container" (click)="$event.stopPropagation()">

        <!-- Header avec barres de progression -->
        <div class="story-header" *ngIf="currentUserStories">
          <div class="progress-bars">
            <div
              *ngFor="let story of currentUserStories.stories; let i = index"
              class="progress-bar"
              [class.active]="i === currentStoryIndex"
              [class.completed]="i < currentStoryIndex"
              (click)="goToStory(i)">
              <div class="progress-fill" [style.width.%]="getProgressPercentage(i)"></div>
            </div>
          </div>

          <div class="user-info">
            <img
              [src]="currentUserStories.userProfileImage || 'assets/img/myLOve/account.png'"
              [alt]="currentUserStories.userFullName"
              class="user-avatar">
            <span class="user-name">{{ currentUserStories.userFullName }}</span>
            <span class="story-time">{{ getStoryTime() }}</span>
          </div>

          <button class="close-btn" (click)="closeViewer()">
            <i class="bi bi-x"></i>
          </button>
        </div>

        <!-- Contenu de la story -->
        <div class="story-content" (click)="nextStory()">
          <div *ngIf="currentStory" class="story-media">
            <!-- Image avec conteneur adaptatif -->
            <div *ngIf="!isVideo(currentStory.mediaUrls[0]) && currentStory.mediaUrls.length > 0"
                 class="image-container">
              <img
                [src]="currentStory.mediaUrls[0]"
                [alt]="currentStory.text || 'Story'"
                class="story-image"
                (load)="onImageLoad()"
                (error)="onImageError()">
            </div>

            <!-- Vidéo avec conteneur adaptatif -->
            <div *ngIf="isVideo(currentStory.mediaUrls[0]) && currentStory.mediaUrls.length > 0"
                 class="video-container">
              <video
                [src]="currentStory.mediaUrls[0]"
                class="story-video"
                autoplay
                muted
                playsinline
                (ended)="nextStory()"
                (loadeddata)="onVideoLoad()">
              </video>
            </div>

            <!-- Texte seulement -->
            <div *ngIf="currentStory.mediaUrls.length === 0 && currentStory.text" class="story-text-only">
              <p>{{ currentStory.text }}</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="story-navigation">
          <div class="nav-left" (click)="previousStory()"></div>
          <div class="nav-right" (click)="nextStory()"></div>
        </div>

        <!-- Footer avec actions -->
        <div class="story-footer">
          <button class="reply-btn" (click)="replyToStory()">
            <i class="bi bi-chat"></i>
            Répondre
          </button>
          <button class="like-btn" (click)="likeStory()" [class.liked]="isLiked">
            <i class="bi" [class.bi-heart]="!isLiked" [class.bi-heart-fill]="isLiked"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./story-viewer.component.css']
})
export class StoryViewerComponent implements OnInit, OnDestroy {
  @Input() userStories: UserStories | null = null;
  @Input() initialStoryIndex: number = 0;
  @Output() close = new EventEmitter<void>();

  currentUserStories: UserStories | null = null;
  currentStoryIndex: number = 0;
  currentStory: StoryDto | null = null;
  isLiked: boolean = false;

  private progressInterval: any;
  private progressUpdateInterval: any;
  private readonly STORY_DURATION = 5000; // 5 secondes par story
  private storyStartTime: number = 0;
  private currentProgress: number = 0;

  constructor(private storyService: StoryService) {}

  ngOnInit() {
    if (this.userStories) {
      this.currentUserStories = this.userStories;
      this.currentStoryIndex = this.initialStoryIndex;
      this.loadCurrentStory();
      this.startStoryTimer();
      this.markCurrentStoryAsRead();
    }
  }

  ngOnDestroy() {
    this.stopAllTimers();
  }

  loadCurrentStory() {
    if (this.currentUserStories && this.currentUserStories.stories.length > 0) {
      this.currentStory = this.currentUserStories.stories[this.currentStoryIndex];
      this.isLiked = false; // Reset like status for new story
    }
  }

  startStoryTimer() {
    this.storyStartTime = Date.now();
    this.currentProgress = 0;

    // Timer pour la progression fluide (mise à jour toutes les 50ms)
    this.progressUpdateInterval = setInterval(() => {
      const elapsed = Date.now() - this.storyStartTime;
      this.currentProgress = Math.min((elapsed / this.STORY_DURATION) * 100, 100);
    }, 50);

    // Timer pour passer à la story suivante
    this.progressInterval = setTimeout(() => {
      this.nextStory();
    }, this.STORY_DURATION);
  }

  stopAllTimers() {
    if (this.progressInterval) {
      clearTimeout(this.progressInterval);
      this.progressInterval = null;
    }
    if (this.progressUpdateInterval) {
      clearInterval(this.progressUpdateInterval);
      this.progressUpdateInterval = null;
    }
  }

  restartStoryTimer() {
    this.stopAllTimers();
    this.startStoryTimer();
  }

  getProgressPercentage(storyIndex: number): number {
    if (!this.currentUserStories) return 0;

    if (storyIndex < this.currentStoryIndex) {
      return 100; // Story terminée
    } else if (storyIndex === this.currentStoryIndex) {
      return this.currentProgress; // Progression actuelle
    }
    return 0; // Story pas encore commencée
  }

  nextStory() {
    if (this.currentUserStories && this.currentStoryIndex < this.currentUserStories.stories.length - 1) {
      this.currentStoryIndex++;
      this.loadCurrentStory();
      this.markCurrentStoryAsRead();
      this.restartStoryTimer();
    } else {
      this.closeViewer();
    }
  }

  previousStory() {
    if (this.currentStoryIndex > 0) {
      this.currentStoryIndex--;
      this.loadCurrentStory();
      this.markCurrentStoryAsRead();
      this.restartStoryTimer();
    }
  }

  goToStory(index: number) {
    if (this.currentUserStories && index >= 0 && index < this.currentUserStories.stories.length) {
      this.currentStoryIndex = index;
      this.loadCurrentStory();
      this.markCurrentStoryAsRead();
      this.restartStoryTimer();
    }
  }

  markCurrentStoryAsRead() {
    if (this.currentStory) {
      this.storyService.markStoryAsRead(this.currentStory.id);
    }
  }

  isVideo(url: string): boolean {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.includes('.mp4') || lower.includes('.webm') || lower.includes('.ogg') ||
           lower.includes('.mov') || lower.includes('.avi');
  }

  onImageLoad() {
    console.log('Image chargée avec succès');
  }

  onImageError() {
    console.error('Erreur lors du chargement de l\'image');
  }

  onVideoLoad() {
    console.log('Vidéo chargée avec succès');
  }

  getStoryTime(): string {
    if (!this.currentStory) return '';

    const now = new Date();
    const storyDate = new Date(this.currentStory.createdAt);
    const diffInMinutes = Math.floor((now.getTime() - storyDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'À l\'instant';
    } else if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes}min`;
    } else {
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) {
        return `Il y a ${diffInHours}h`;
      } else {
        return storyDate.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    }
  }

  replyToStory() {
    this.stopAllTimers(); // Pause la story pendant la réponse
    console.log('Répondre à la story:', this.currentStory?.id);
    // TODO: Implémenter la réponse
    // Redémarrer le timer après la réponse
    setTimeout(() => {
      this.restartStoryTimer();
    }, 100);
  }

  likeStory() {
    this.isLiked = !this.isLiked;
    console.log('Like story:', this.currentStory?.id, this.isLiked);
    // TODO: Implémenter le like côté serveur
  }

  closeViewer() {
    this.stopAllTimers();
    this.close.emit();
  }
}
