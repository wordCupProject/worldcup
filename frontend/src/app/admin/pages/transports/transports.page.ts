// src/app/admin/pages/transports/transports.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-transports',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './transports.page.html',
  styleUrls: ['./transports.page.css']
})
export class TransportsPage {
  transports = [
    { type: 'Bus', city: 'Marrakech', capacity: 50 },
    { type: 'Tramway', city: 'Casablanca', capacity: 200 },
    { type: 'Train', city: 'Rabat', capacity: 300 }
  ];
}
