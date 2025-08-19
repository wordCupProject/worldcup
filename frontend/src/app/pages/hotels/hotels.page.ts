import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HotelService, HotelDTO } from '../../services/hotel.service';
import { Router } from '@angular/router'; 

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
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './hotels.page.html',
  styleUrls: ['./hotels.page.css']
})
export class HotelsPage implements OnInit {
  cityFilter = '';
  guestsFilter = '1';
  priceFilter = '';
  ratingFilter = '';

  hotels: Hotel[] = [];

  // Injection du Router dans le constructeur
  constructor(private hotelService: HotelService, private router: Router) {}

  ngOnInit(): void {
    this.hotelService.getAllHotels().subscribe({
      next: (data: HotelDTO[]) => {
        this.hotels = data.map((dto) => ({
          title: dto.name,
          city: dto.city,
          distanceToStadium: 'Proche du stade',
          rating: dto.stars,
          features: dto.services,
          price: 1000,
          status: 'confirmed',
          image: dto.photoPath ? this.hotelService.getImageUrl(dto.photoPath) : 'https://via.placeholder.com/600x400',
          alt: dto.name,
        }));
      },
      error: (err) => {
        console.error('Erreur récupération hôtels', err);
      }
    });
  }

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
    // Rien ici, tout est géré par le getter
  }

  // Méthode pour naviguer vers la page de login
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}