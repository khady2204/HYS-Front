import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CustomToastService {
  show(
    message: string,
    type: 'success' | 'error' | 'info' = 'success',
    duration: number = 1000
  ) {
    const toast = document.createElement('div');
    toast.textContent = message;

    // Couleur selon le type
    let bg = '#ff008a'; // par défaut
    if (type === 'success') bg = '#28a745';
    if (type === 'error') bg = '#dc3545';
    if (type === 'info') bg = '#ac8c00ff';

    toast.style.cssText = `
      position: absolute;
      top: 50vh;               
      left: 50%;
      transform: translate(-50%, -50%) scale(0.9);
      background: ${bg};
      color: white;
      text-align: center;
      font-weight: 500;
      padding: 14px 28px;
      font-size: 16px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 99999;
      opacity: 0;
      transition: opacity 0.3s ease, transform 0.3s ease;
      max-width: 100%;
      word-wrap: break-word;
    `;

    const container = document.querySelector('ion-app') || document.body;
    container.appendChild(toast);

    // Animation d’apparition
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    // Disparition automatique
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translate(-50%, -50%) scale(0.9)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
}
