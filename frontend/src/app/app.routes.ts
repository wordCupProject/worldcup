// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { InscriptionPage } from './pages/inscription/inscription.page';
import { LoginPage } from './pages/login/login.page';
import{HotelsPage} from './pages/hotels/hotels.page'
import { adminRoutes } from './admin/admin.routes'; // Import des routes admin

export const routes: Routes = [
  { path: '', component: DashboardPage },
  { path: 'inscription', component: InscriptionPage },
  { path: 'login', component: LoginPage },
   { path: 'hotels', component: HotelsPage },
  
  // Route pour l'admin avec des enfants
  { 
    path: 'admin', 
    children: adminRoutes,
    // Ajouter un garde de route ici si nécessaire
    // canActivate: [AuthGuard]
  },
  
  { path: '**', redirectTo: '' }
];