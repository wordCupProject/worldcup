import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';  
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService, RegisterPayload } from '../../services/auth.service';
import { FooterComponent } from '../../components/footer/footer.component';  
import{NavbarComponent} from '../../components/navbar/navbar.component'
interface Hotel {
  title: string;
  city: string;
  distanceToStadium: string;
  rating: number;
  ratingHalf?: boolean;
  features: string[];
  price: number;
  status: 'confirmed' | 'pending';
  image: string;
  alt: string;
}

@Component({
  selector: 'app-hotels',
   standalone: true,
  imports: [  CommonModule,
    ReactiveFormsModule, FormsModule , NavbarComponent, FooterComponent],
  templateUrl: './hotels.page.html',
  styleUrls: ['./hotels.page.css']


})
export class HotelsPage {

  cityFilter = '';
  guestsFilter = '1';
  priceFilter = '';
  ratingFilter = '';

  hotels: Hotel[] = [
    {
      title: 'Hôtel Marrakech Plaza',
      city: 'marrakech',
      distanceToStadium: '2km',
      rating: 5,
      features: ['WiFi gratuit', 'Piscine', 'Petit-déjeuner', 'Parking'],
      price: 850,
      status: 'confirmed',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      alt: 'Hôtel Marrakech Plaza'
    },
    {
      title: 'Casablanca Royal',
      city: 'casablanca',
      distanceToStadium: '1.5km',
      rating: 4,
      ratingHalf: true,
      features: ['Spa', 'Restaurant', 'Gym', 'Navette stade'],
      price: 1200,
      status: 'pending',
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      alt: 'Casablanca Royal'
    },
    {
      title: 'Rabat Suites',
      city: 'rabat',
      distanceToStadium: '3km',
      rating: 4,
      features: ['Vue mer', 'WiFi gratuit', 'Climatisation', 'Bar'],
      price: 950,
      status: 'confirmed',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      alt: 'Rabat Suites'
    },
    {
      title: 'Fès Palace',
      city: 'fes',
      distanceToStadium: '4km',
      rating: 5,
      features: ['Piscine', 'Spa', 'Petit-déjeuner buffet', 'Navette gratuite'],
      price: 1100,
      status: 'confirmed',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      alt: 'Fès Palace'
    },
    {
      title: 'Tanger View',
      city: 'tanger',
      distanceToStadium: '',
      rating: 4,
      ratingHalf: true,
      features: ['Vue mer', 'Restaurant gastronomique', 'Salle de sport', 'Navette stade'],
      price: 1400,
      status: 'pending',
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      alt: 'Tanger View'
    },
    {
      title: 'Atlas Marrakech',
      city: 'marrakech',
      distanceToStadium: 'Proche médina',
      rating: 3,
      features: ['Jardin', 'WiFi gratuit', 'Climatisation', 'Petit-déjeuner'],
      price: 650,
      status: 'confirmed',
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      alt: 'Atlas Marrakech'
    }
  ];

  // Filtre simple : retourner les hôtels qui correspondent aux filtres sélectionnés
  get filteredHotels() {
    return this.hotels.filter(hotel => {
      const cityMatch = this.cityFilter ? hotel.city === this.cityFilter : true;
      const ratingMatch = this.ratingFilter ? hotel.rating === +this.ratingFilter : true;
      const priceMatch = (() => {
        if (!this.priceFilter) return true;
        if (this.priceFilter === '2000+') return hotel.price > 2000;
        const [min, max] = this.priceFilter.split('-').map(Number);
        return hotel.price >= min && hotel.price <= max;
      })();

      return cityMatch && ratingMatch && priceMatch;
    });
  }

  onSearch() {
    // Ici on peut déclencher d'autres actions si besoin,
    // mais la getter filteredHotels est reactive avec les bindings Angular.
    alert('jfjjfjfj');
  }

}
