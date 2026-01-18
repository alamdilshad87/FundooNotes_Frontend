import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./auth/register/register').then(m => m.RegisterComponent) },
  { path: 'otp', loadComponent: () => import('./auth/otp-verify/otp-verify').then(m => m.OtpVerifyComponent) },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
