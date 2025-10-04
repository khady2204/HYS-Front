import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Platform } from '@ionic/angular';
import { IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-floating-menu',
  templateUrl: './floating-menu.component.html',
  styleUrls: ['./floating-menu.component.css'],
  imports: []  // <-- AJOUT ICI
})
export class FloatingMenuComponent implements OnInit, OnDestroy {

  private keyboardListener: any;

  constructor(
    private platform: Platform,
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
    // Écouter les événements du clavier virtuel
    if (this.platform.is('cordova') || this.platform.is('capacitor')) {
      this.setupKeyboardListeners();
    }
  }

  ngOnDestroy() {
    if (this.keyboardListener) {
      this.keyboardListener.remove();
    }
  }

  private setupKeyboardListeners() {
    // Détecter l'ouverture du clavier
    window.addEventListener('keyboardWillShow', () => {
      this.onKeyboardShow();
    });

    window.addEventListener('keyboardWillHide', () => {
      this.onKeyboardHide();
    });

    // Alternative pour les navigateurs web
    if (this.platform.is('mobileweb')) {
      this.setupWebKeyboardDetection();
    }
  }

  private setupWebKeyboardDetection() {
    let initialViewportHeight = window.visualViewport?.height || window.innerHeight;

    const handleViewportChange = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      const heightDifference = initialViewportHeight - currentHeight;

      if (heightDifference > 150) { // Clavier probablement ouvert
        this.onKeyboardShow();
      } else {
        this.onKeyboardHide();
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
    } else {
      window.addEventListener('resize', handleViewportChange);
    }
  }

  private onKeyboardShow() {
    const menuElement = this.elementRef.nativeElement.querySelector('.menu-bottom-fixed');
    if (menuElement) {
      menuElement.classList.add('keyboard-open');
    }
  }

  private onKeyboardHide() {
    const menuElement = this.elementRef.nativeElement.querySelector('.menu-bottom-fixed');
    if (menuElement) {
      menuElement.classList.remove('keyboard-open');
    }
  }
}
