// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { InscriptionPage } from './pages/inscription/inscription.page';
import { LoginPage } from './pages/login/login.page';

import { adminRoutes } from './admin/admin.routes'; // Import des routes admin
import { Oauth2Redirect } from './pages/oauth2-redirect/oauth2-redirect';

import { HotelsPage } from './pages/hotels/hotels.page';
import { DashboardUserPage } from './user/dashboard/dashboard.page';
import { TransportComponent } from './pages/transports/transports.page';

export const routes: Routes = [
  { path: '', component: DashboardPage },
  { path: 'inscription', component: InscriptionPage },
  { path: 'login', component: LoginPage },
  { path: 'oauth2-redirect', component: Oauth2Redirect },
  { path: 'hotels', component: HotelsPage },
  { path: 'transports', component: TransportComponent },

  // ✅ Route vers le tableau de bord utilisateur
  { path: 'user', component: DashboardUserPage },

  // ✅ Route pour l'administration
  {
    path: 'admin',
    children: adminRoutes,
    // canActivate: [AuthGuard] // si besoin
  },

  // ❌ Dernière position : redirection par défaut
  { path: '**', redirectTo: '' },
];
