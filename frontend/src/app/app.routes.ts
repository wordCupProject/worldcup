// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { InscriptionPage } from './pages/inscription/inscription.page'; // Correction du nom

export const routes: Routes = [
  { path: '', component: DashboardPage },
  { path: 'inscription', component: InscriptionPage }, // Même nom ici
  { path: '**', redirectTo: '' }
];