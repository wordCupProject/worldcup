import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService, RegisterPayload } from '../../services/auth.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

interface Transport {
    id: number;
    type: 'PLANE' | 'BUS' | 'TRAIN' | 'CAR';
    departureCity: string;
    arrivalCity: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
}

@Component({
    selector: 'app-transports',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, NavbarComponent, FooterComponent],
    templateUrl: './transports.page.html',
    styleUrls: ['./transports.page.css']
})
export class TransportComponent {
    departureCityFilter: string = '';
    arrivalCityFilter: string = '';
    typeFilter: string = '';
    dateFilter: string = '';
    minPriceFilter: number | null = null;
    maxPriceFilter: number | null = null;
    priceRangeFilter: string = '';

    possibleDepartureCities = ['Marrakech', 'Casablanca', 'Rabat', 'Fès', 'Toulouse'];
    possibleArrivalCities = ['Marrakech', 'Casablanca', 'Rabat', 'Fès', 'Toulouse'];
    possibleTypes = ['PLANE', 'BUS', 'TRAIN', 'CAR'];
    availableDates = ['2025-07-10', '2025-07-11', '2025-07-12'];

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

    get filteredTransports() {
        return this.transports.filter(t => {
            if (this.departureCityFilter && t.departureCity !== this.departureCityFilter) return false;
            if (this.arrivalCityFilter && t.arrivalCity !== this.arrivalCityFilter) return false;
            if (this.typeFilter && t.type !== this.typeFilter) return false;
            if (this.dateFilter && !t.departureTime.startsWith(this.dateFilter)) return false;

            // Filtre par plage de prix
            if (this.priceRangeFilter) {
                const [minStr, maxStr] = this.priceRangeFilter.split('-');
                const minPrice = parseFloat(minStr);
                const maxPrice = maxStr ? (maxStr === '+' ? Infinity : parseFloat(maxStr)) : Infinity;
                if (t.price < minPrice || t.price > maxPrice) return false;
            } else {
                if (this.minPriceFilter !== null && t.price < this.minPriceFilter) return false;
                if (this.maxPriceFilter !== null && t.price > this.maxPriceFilter) return false;
            }

            return true;
        });
    }

    // Si vous souhaitez utiliser un bouton de recherche, cette méthode peut être vide ou supprimer
    onSearch() {
        // Rien à faire si vous utilisez le getter filteredTransports dans le template
    }
}
