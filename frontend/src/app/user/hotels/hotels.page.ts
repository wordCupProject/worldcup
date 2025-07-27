import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { HotelService, HotelDTO } from '../../services/hotel.service';
import { AuthService } from '../../services/auth.service'; // Import du service d'authentification

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
  imports: [CommonModule, FormsModule],
  templateUrl: './hotels.page.html',
  styleUrls: ['./hotels.page.css']
})
export class HotelsUser implements OnInit {
  cityFilter = '';
  guestsFilter = '1';
  priceFilter = '';
  ratingFilter = '';

  hotels: Hotel[] = [];

  // Propriétés ajoutées
  userEmail: string = '';
  userDropdownOpen = false;

  // Injection du service d'authentification
  constructor(
    private hotelService: HotelService, 
    private router: Router,
    private authService: AuthService // Service ajouté
  ) {}

  ngOnInit(): void {
    // Récupération de l'email depuis le service d'authentification
    this.loadUserEmail();

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

  // Méthode pour charger l'email de l'utilisateur
  loadUserEmail(): void {
    const user = this.authService.getAuthenticatedUser();
    if (user && user.email) {
      this.userEmail = user.email;
    } else {
      this.userEmail = 'Invité';
    }
  }

  // Méthode de déconnexion
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
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

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}