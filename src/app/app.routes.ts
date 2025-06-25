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
  },  {
    path: 'suggestion',
    loadComponent: () => import('./pages/suggestion/suggestion.page').then( m => m.SuggestionPage)
  },


];
