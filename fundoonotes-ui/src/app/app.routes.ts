import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'otp',
    loadComponent: () => import('./auth/otp-verify/otp-verify').then(m => m.OtpVerifyComponent)
  },
  {
    path: 'notes',
    canActivate: [authGuard],
    loadComponent: () => import('./notes/notes').then(m => m.NotesComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./notes/dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'trash',
        loadComponent: () => import('./notes/trash/trash').then(m => m.TrashComponent)
      },
      {
        path: 'archive',
        loadComponent: () => import('./notes/archive/archive').then(m => m.ArchiveComponent)
      },
      // ✅ ADD LABEL ROUTE
      {
        path: 'label/:id',
        loadComponent: () => import('./notes/label-view/label-view').then(m => m.LabelViewComponent)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'notes',
    pathMatch: 'full'
  }
];
