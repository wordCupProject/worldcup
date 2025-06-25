// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
 // <-- nouvel import

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  standalone: true,
  template: `
   
    <router-outlet></router-outlet>

     <!-- <-- ici ton footer -->
  `
})
export class AppComponent {}


