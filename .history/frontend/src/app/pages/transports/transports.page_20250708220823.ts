import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';  
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService, RegisterPayload } from '../../services/auth.service';
import { FooterComponent } from '../../components/footer/footer.component';  
import{NavbarComponent} from '../../components/navbar/navbar.component'

interface Transport {
  id: number;
  type: 'PLANE' | 'BUS' | 'TRAIN' | 'CAR'; // Ajoutez d'autres si nécessaire
  departureCity: string;
  arrivalCity: string;
  departureTime: string; // Format ISO (e.g., '2025-07-10T08:00')
  arrivalTime: string;
  price: number;
}



@Component({
  selector: 'app-transports',
   standalone: true,
  imports: [  CommonModule,
    ReactiveFormsModule, FormsModule , NavbarComponent, FooterComponent],
  templateUrl: './transports.page.html',
  styleUrls: ['./transports.page.css']


})
export class TransportComponent {

  // Filtres
 // Votre classe  
export class TransportsPage {  
  departureCityFilter: string = '';  
  arrivalCityFilter: string = '';  
  typeFilter: string = '';  
  dateFilter: string = '';  
  minPriceFilter: number | null = null;  
  maxPriceFilter: number | null = null;  
  

  // Liste de transports (exemple)
  transports: Transport[] = [
    {
      id: 1,
      type: 'PLANE',
      departureCity: 'Marrakech',
      arrivalCity: 'Casablanca',
      departureTime: '2025-07-10T08:00',
      arrivalTime: '2025-07-10T09:30',
      price: 800
    },
    {
      id: 2,
      type: 'BUS',
      departureCity: 'Rabat',
      arrivalCity: 'Fès',
      departureTime: '2025-07-10T07:00',
      arrivalTime: '2025-07-10T10:00',
      price: 150
    },
    {
      id: 3,
      type: 'TRAIN',
      departureCity: 'Casablanca',
      arrivalCity: 'Marrakech',
      departureTime: '2025-07-11T14:00',
      arrivalTime: '2025-07-11T17:00',
      price: 200
    },
    // Ajoutez d'autres éléments pour tester
  ];

  // Getter pour la liste filtrée
  get filteredTransports() {
    return this.transports.filter(t => {
      const departureMatch = this.departureCityFilter
        ? t.departureCity.toLowerCase().includes(this.departureCityFilter.toLowerCase())
        : true;
      const arrivalMatch = this.arrivalCityFilter
        ? t.arrivalCity.toLowerCase().includes(this.arrivalCityFilter.toLowerCase())
        : true;
      const typeMatch = this.typeFilter ? t.type === this.typeFilter : true;
      const dateMatch = this.dateFilter ? t.departureTime.startsWith(this.dateFilter) : true;
      const priceMatch = (() => {
        if (this.minPriceFilter !== null && t.price < this.minPriceFilter) return false;
        if (this.maxPriceFilter !== null && t.price > this.maxPriceFilter) return false;
        return true;
      })();

      return departureMatch && arrivalMatch && typeMatch && dateMatch && priceMatch;
    });
  }

  onSearch() {
    // La liste est automatiquement réactive via la getter
    // Vous pouvez ajouter des actions ici si besoin
  }
}