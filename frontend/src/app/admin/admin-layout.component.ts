// src/app/admin/admin-layout.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarAdminComponent } from './components/navbar-admin/navbar-admin.component';
import { FooterAdminComponent } from './components/footer-admin/footer-admin.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    NavbarAdminComponent,
    FooterAdminComponent
  ],
  template: `
    <div class="flex h-screen">
      <app-sidebar></app-sidebar>
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-navbar-admin></app-navbar-admin>
        <main class="flex-1 overflow-y-auto p-6 bg-gray-100">
          <router-outlet></router-outlet>
        </main>
        <app-footer-admin></app-footer-admin>
      </div>
    </div>
  `,
  styles: []
})
export class AdminLayoutComponent {}