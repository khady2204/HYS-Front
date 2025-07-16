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
    path: 'dashboard',
    loadComponent: () => import('./pages/rencontre/rencontre.page').then(m => m.RencontrePage)
  },
  {
    path: 'suggestion',
    loadComponent: () => import('./pages/suggestion/suggestion.page').then( m => m.SuggestionPage)
  },
  {
    path: 'otp-verification',
    loadComponent: () => import('./pages/otp-verification/otp-verification.page').then( m => m.OtpVerificationPage)
  },
  {
    path: 'construction',
    loadComponent: () => import('./pages/construction/construction.page').then( m => m.ConstructionPage)
  },
  {
    path: 'accueil',
    loadComponent: () => import('./pages/accueil/accueil.page').then( m => m.AccueilPage)
  },
  {
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
