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
    path: 'dashbord',
    loadComponent: () => import('./pages/dashbord/dashbord.page').then( m => m.DashbordPage)
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
    path: 'f-password',
    loadComponent: () => import('./pages/f-password/f-password.page').then( m => m.FPasswordPage)
  },  {
    path: 'validationsms',
    loadComponent: () => import('./pages/validationsms/validationsms.page').then( m => m.ValidationsmsPage)
  },

];
