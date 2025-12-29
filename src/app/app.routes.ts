import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        canActivate: [roleGuard],
        data: { roles: ['exporter', 'logistics', 'quality', 'admin'] },
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'requests',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/requests/request-list/request-list.component').then(m => m.RequestListComponent)
          },
          {
            path: 'new',
            canActivate: [roleGuard],
            data: { roles: ['importer'] },
            loadComponent: () => import('./features/requests/request-create/request-create.component').then(m => m.RequestCreateComponent)
          }
        ]
      },
      {
        path: 'quotations',
        loadComponent: () => import('./features/quotations/quotation-list/quotation-list.component').then(m => m.QuotationListComponent)
      },
      {
        path: 'shipments',
        loadComponent: () => import('./features/shipments/shipment-tracking/shipment-tracking.component').then(m => m.ShipmentTrackingComponent)
      },
      {
        path: 'documents',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'reports',
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'importer',
        canActivate: [roleGuard],
        data: { roles: ['importer'] },
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
          },
          {
            path: 'dashboard',
            loadComponent: () => import('./features/importer/dashboard/importer-dashboard.component').then(m => m.ImporterDashboardComponent)
          },
          {
            path: 'requests',
            loadComponent: () => import('./features/importer/requests/my-requests.component').then(m => m.MyRequestsComponent)
          },
          {
            path: 'requests/new',
            loadComponent: () => import('./features/requests/request-create/request-create.component').then(m => m.RequestCreateComponent)
          },
          {
            path: 'requests/:id',
            loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
          },
          {
            path: 'quotations/:requestId',
            loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
          },
          {
            path: 'tracking/:requestId',
            loadComponent: () => import('./features/shipments/shipment-tracking/shipment-tracking.component').then(m => m.ShipmentTrackingComponent)
          },
          {
            path: 'documents',
            loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
          },
          {
            path: 'notifications',
            loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
          }
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
