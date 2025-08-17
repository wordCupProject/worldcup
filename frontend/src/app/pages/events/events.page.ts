import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
@Component({
  selector: 'app-events-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.css']
})
export class EventsPage {
  events = [
    {
      date: '14 Juin 2030',
      title: 'Cérémonie d\'ouverture',
      location: 'Stade de Marrakech, 18:00',
      tags: ['Urgent', 'Préparation']
    },
    {
      date: '15 Juin 2030',
      title: 'Maroc vs Brésil',
      location: 'Stade de Casablanca, 20:00',
      tags: ['Match']
    },
    {
      date: '20 Juin 2030',
      title: 'Réunion des organisateurs',
      location: 'Hôtel Royal, Rabat, 10:00',
      tags: ['Réunion']
    }
  ];
}
