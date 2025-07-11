import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

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
    loadComponent: () => import('./pages/dashboard/dashboard.page').then( m => m.DashboardPage),
    canActivate: [AuthGuard]
  },
 
  {
    path: 'f-password',
    loadComponent: () => import('./pages/reset-password/f-password.page').then( m => m.FPasswordPage)
  },
  {
    path: 'validationsms',
    loadComponent: () => import('./pages/validationsms/validationsms.page').then( m => m.ValidationsmsPage)
  },
  {
    path: 'registration-success',
    loadComponent: () => import('./pages/registration-success/registration-success.page').then( m => m.RegistrationSuccessPage)
  },
  {
    path: 'confirmation',
    loadComponent: () => import('./pages/confirmation/confirmation.page').then( m => m.ConfirmationPage)
  },
  {
    path: 'new-password',
    loadComponent: () => import('./pages/new-password/new-password.page').then( m => m.NewPasswordPage)
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
    path: 'otp-verification',
    loadComponent: () => import('./pages/otp-verification/otp-verification.page').then( m => m.OtpVerificationPage)
  },


];
