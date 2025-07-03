// src/app/admin/admin.routes.ts
import { Routes } from '@angular/router';
import { AdminDashboardPage } from './pages/dashboard/admin-dashboard.page';
import { HotelsPage } from './pages/hotels/hotels.page';
import { TransportsPage } from './pages/transports/transports.page';
import { OrganizationsPage } from './pages/organizations/organizations.page';
import { AdminLayoutComponent } from './admin-layout.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: AdminDashboardPage },
      { path: 'hotels', component: HotelsPage },
      { path: 'transports', component: TransportsPage },
      { path: 'organizations', component: OrganizationsPage },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];