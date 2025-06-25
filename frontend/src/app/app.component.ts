// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';  // <-- nouvel import

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  standalone: true,
  template: `
    <app-navbar></app-navbar>

    <router-outlet></router-outlet>

    <app-footer></app-footer>   <!-- <-- ici ton footer -->
  `
})
export class AppComponent {}


