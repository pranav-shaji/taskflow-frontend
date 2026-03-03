import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  // Public routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Layout container (NO guard here)
  {
    path: '',
    component: LayoutComponent,
    children: [

      // Default redirect
      { path: '', redirectTo: 'tasks', pathMatch: 'full' },

      // Protected routes
      {
        path: 'tasks',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/tasks/pages/tasks-page/tasks-page')
            .then(m => m.TasksPageComponent)
      },

      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard-page/dashboard-page')
            .then(m => m.DashboardPageComponent)
      }
    ]
  },

  // Fallback
  { path: '**', redirectTo: 'login' }
];