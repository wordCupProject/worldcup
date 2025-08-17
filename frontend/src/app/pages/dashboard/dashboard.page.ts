import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HotelService, HotelDTO } from '../../services/hotel.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterModule],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.css']
})
export class DashboardPage implements OnInit {
  totalHotels: number = 0;
  bookingPercentage: number = 0;
  latestHotels: HotelDTO[] = [];
  daysLeft: number = 0;
  // Coordonnées de support
  supportPhone = '+212522000000';
  supportEmail = 'support@coupedumonde2030.ma';

  constructor(private hotelService: HotelService) {}

  ngOnInit(): void {
    this.loadHotelData();
    this.calculateDaysLeft();
  }

   calculateDaysLeft(): void {
    const eventDate = new Date('2030-06-14T00:00:00'); // ouverture
    const today = new Date();

    const diffTime = eventDate.getTime() - today.getTime();
    this.daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  loadHotelData(): void {
    this.hotelService.getAllHotels().subscribe({
      next: (hotels) => {
        this.totalHotels = hotels.length;
        
        // Calcul des statistiques de réservation (exemple)
        const confirmedHotels = Math.floor(this.totalHotels * 0.65);
        this.bookingPercentage = Math.round((confirmedHotels / this.totalHotels) * 100);
        
        // Derniers hôtels ajoutés (3 premiers)
        this.latestHotels = [...hotels]
          .sort((a, b) => (b.id || 0) - (a.id || 0)) // Tri par ID décroissant
          .slice(0, 3);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des hôtels :', err);
      }
    });
  }

  getStatusClass(index: number): string {
    const statuses = ['bg-green-100 text-green-800', 'bg-yellow-100 text-yellow-800', 'bg-green-100 text-green-800'];
    return statuses[index % statuses.length];
  }

  getStatusText(index: number): string {
    const statuses = ['Confirmé', 'En attente', 'Confirmé'];
    return statuses[index % statuses.length];
  }

  // Fonction pour appeler le support
  callSupport() {
    window.location.href = `tel:${this.supportPhone}`;
  }

  // Fonction pour envoyer un email
  emailSupport() {
    const subject = encodeURIComponent('Demande de support - Coupe du Monde 2030');
    const body = encodeURIComponent('Bonjour,\n\nJ\'ai besoin d\'assistance concernant...');
    window.location.href = `mailto:${this.supportEmail}?subject=${subject}&body=${body}`;
  }
}