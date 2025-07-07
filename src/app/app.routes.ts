import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then( m => m.DashboardPage)
  },
  {
    path: 'f-password',
    loadComponent: () => import('./pages/f-password/f-password.page').then( m => m.FPasswordPage)
  },
  {
    path: 'rencontre',
    loadComponent: () => import('./pages/rencontre/rencontre.page').then( m => m.RencontrePage)
  },
  {
    path: 'suggestion',
    loadComponent: () => import('./pages/suggestion/suggestion.page').then( m => m.SuggestionPage)
  },


  {
    path: 'f-password',
    loadComponent: () => import('./pages/f-password/f-password.page').then( m => m.FPasswordPage)
  },
  {
    path: 'construction',
    loadComponent: () => import('./pages/construction/construction.page').then( m => m.ConstructionPage)
  },
  {
    path: 'accueil',
    loadComponent: () => import('./pages/accueil/accueil.page').then( m => m.AccueilPage)
  },  {
    path: 'discussions',
    loadComponent: () => import('./pages/discussions/discussions.page').then( m => m.DiscussionsPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'chat',
    loadComponent: () => import('./pages/chat/chat.page').then( m => m.ChatPage)
  },
  {
    path: 'edit-profile',
    loadComponent: () => import('./pages/edit-profile/edit-profile.page').then( m => m.EditProfilePage)
  },
  {
    path: 'report-partner',
    loadComponent: () => import('./pages/report-partner/report-partner.page').then( m => m.ReportPartnerPage)
  },


];
