import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransportService } from '../../services/transport.service';
import { 
  TransportDTO, 
  TransportType, 
  TRANSPORT_TYPES,
  TRANSPORT_TYPE_LABELS,
  PriceRange,
  PRICE_RANGES
} from '../../models/transport.models';

@Component({
  selector: 'app-user-transports',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './transports.page.html',
  styleUrls: ['./transports.page.css']
})
export class UserTransportComponent implements OnInit {
  transports: TransportDTO[] = [];
  filteredTransports: TransportDTO[] = [];
  searchForm: FormGroup;
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;

  // États pour réservation
  private reservingIds = new Set<number>();

  // Constantes pour le template
  transportTypes = TRANSPORT_TYPES;
  cities = ['Marrakech', 'Casablanca', 'Rabat', 'Fès', 'Toulouse', 'Madrid', 'Lisbonne', 'Tanger', 'Agadir'];
  priceRanges = PRICE_RANGES;
  
  // Rendre Infinity accessible au template
  readonly Infinity = Infinity;

  // Propriétés calculées pour les filtres
  possibleDepartureCities: string[] = [];
  possibleArrivalCities: string[] = [];
  possibleTypes = TRANSPORT_TYPES;

  constructor(
    private transportService: TransportService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.createSearchForm();
  }

  ngOnInit() {
    this.loadTransports();
  }

  private createSearchForm(): FormGroup {
    return this.fb.group({
      departureCityFilter: [''],
      arrivalCityFilter: [''],
      typeFilter: [''],
      dateFilter: [''],
      priceRangeFilter: [''],
      worldCupOnlyFilter: [false],
      availableOnlyFilter: [false]
    });
  }

  loadTransports() {
    this.loading = true;
    this.error = null;
    
    this.transportService.getAllTransports().subscribe({
      next: (data) => {
        this.transports = data;
        this.filteredTransports = [...this.transports];
        this.updateFilterOptions();
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        console.error('Erreur lors du chargement des transports:', error);
      }
    });
  }

  private updateFilterOptions() {
    this.possibleDepartureCities = [...new Set(this.transports.map(t => t.departureCity))].sort();
    this.possibleArrivalCities = [...new Set(this.transports.map(t => t.arrivalCity))].sort();
  }

  // Méthodes de formatage
  formatPrice(price: number): string {
    return `${price.toLocaleString('fr-MA')} MAD`;
  }

  formatDate(dateTime: string): string {
    try {
      const date = new Date(dateTime);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit'
      });
    } catch {
      return dateTime.split('T')[0] || dateTime;
    }
  }

  formatTime(dateTime: string): string {
    try {
      const date = new Date(dateTime);
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateTime.split('T')[1]?.substring(0, 5) || dateTime;
    }
  }

  // Méthodes World Cup
  isWorldCupRoute(transport: TransportDTO): boolean {
    return transport.isWorldCupRoute === true;
  }

  isWorldCupPeriod(transport: TransportDTO): boolean {
    try {
      const date = new Date(transport.departureTime);
      const worldCupStart = new Date('2030-06-01');
      const worldCupEnd = new Date('2030-07-31');
      return date >= worldCupStart && date <= worldCupEnd;
    } catch {
      return false;
    }
  }

  // Méthodes d'offres spéciales
  hasSpecialOffer(transport: TransportDTO): boolean {
    return transport.specialOffer === true || transport.price < 500;
  }

  getSpecialOfferText(transport: TransportDTO): string {
    if (transport.specialOffer) {
      return 'OFFRE SPÉCIALE';
    }
    if (transport.price < 500) {
      return 'PRIX RÉDUIT';
    }
    return '';
  }

  // Méthodes de réservation
  canReserveTransport(transport: TransportDTO): boolean {
    return !this.isTransportFull(transport) && !this.isReserving(transport.id || 0);
  }

  trackReservationAttempt(transport: TransportDTO): void {
    console.log('Tentative de réservation pour le transport:', transport.id);
  }

  getReservationButtonText(transport: TransportDTO): string {
    if (this.isTransportFull(transport)) {
      return 'COMPLET';
    }
    if (this.isReserving(transport.id || 0)) {
      return 'Réservation...';
    }
    if (this.isWorldCupRoute(transport)) {
      return 'RÉSERVER';
    }
    return 'RÉSERVER';
  }

  // Méthodes d'icônes et labels
  getTransportIcon(type: TransportType): string {
    const transport = TRANSPORT_TYPES.find(t => t.value === type);
    return transport?.icon || '🚗';
  }

  getTransportTypeLabel(type: TransportType): string {
    return TRANSPORT_TYPE_LABELS[type];
  }

  // Méthodes de disponibilité
  getAvailabilityClass(transport: TransportDTO): string {
    if (transport.place === 0) return 'text-red-600';
    if (transport.place <= 5) return 'text-orange-600';
    return 'text-green-600';
  }

  getOccupancyRate(transport: TransportDTO): number {
    if (transport.capacite === 0) return 0;
    const occupied = transport.capacite - transport.place;
    return Math.round((occupied / transport.capacite) * 100);
  }

  // Méthodes de durée et calcul
  calculateDuration(departureTime: string, arrivalTime: string): string {
    try {
      const departure = new Date(departureTime);
      const arrival = new Date(arrivalTime);
      const diffMs = arrival.getTime() - departure.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (diffHours > 0) {
        return `${diffHours}h${diffMinutes > 0 ? ` ${diffMinutes}min` : ''}`;
      }
      return `${diffMinutes}min`;
    } catch {
      return 'N/A';
    }
  }

  // Méthodes de track pour performance
  trackTransportView(index: number, transport: TransportDTO): number {
    return transport.id || index;
  }

  getAriaLabel(transport: TransportDTO): string {
    return `Transport ${this.getTransportTypeLabel(transport.type)} de ${transport.departureCity} à ${transport.arrivalCity}, ${transport.place} places disponibles, prix ${this.formatPrice(transport.price)}`;
  }

  // Filtrage et recherche
  onSearch() {
    const formValues = this.searchForm.value;
    
    this.filteredTransports = this.transports.filter(t => {
      const matchesDate = formValues.dateFilter ? t.departureTime.startsWith(formValues.dateFilter) : true;
      const matchesDeparture = formValues.departureCityFilter ? t.departureCity === formValues.departureCityFilter : true;
      const matchesArrival = formValues.arrivalCityFilter ? t.arrivalCity === formValues.arrivalCityFilter : true;
      const matchesType = formValues.typeFilter ? t.type === formValues.typeFilter : true;
      const matchesWorldCup = formValues.worldCupOnlyFilter ? this.isWorldCupRoute(t) : true;
      const matchesAvailable = formValues.availableOnlyFilter ? t.place > 0 : true;
      
      // Prix range filter
      let matchesPrice = true;
      if (formValues.priceRangeFilter) {
        const [min, max] = formValues.priceRangeFilter.split('-').map(Number);
        matchesPrice = t.price >= min && (max === 999999 ? true : t.price <= max);
      }
      
      return matchesDate && matchesDeparture && matchesArrival && matchesType && matchesWorldCup && matchesAvailable && matchesPrice;
    });
  }

  clearFilters() {
    this.searchForm.reset();
    this.filteredTransports = [...this.transports];
  }

  sortTransports(criteria: 'price' | 'departure' | 'availability') {
    switch (criteria) {
      case 'price':
        this.filteredTransports.sort((a, b) => a.price - b.price);
        break;
      case 'departure':
        this.filteredTransports.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
        break;
      case 'availability':
        this.filteredTransports.sort((a, b) => b.place - a.place);
        break;
    }
  }

  // Méthodes réservation
  isTransportFull(transport: TransportDTO): boolean {
    return transport.place <= 0;
  }

  isReserving(transportId: number): boolean {
    return this.reservingIds.has(transportId);
  }

  onReserve(transport: TransportDTO) {
    if (!transport.id) {
      this.error = 'Erreur: ID du transport manquant';
      return;
    }
    
    if (this.isTransportFull(transport)) {
      this.error = 'Ce transport est complet !';
      return;
    }

    // Vérifier si l'utilisateur est connecté
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');

    if (!userId || !userName || !userEmail) {
      this.error = 'Vous devez être connecté pour effectuer une réservation';
      return;
    }

    this.reservingIds.add(transport.id);

    // Créer la réservation
    const reservationData = {
      userId: Number(userId),
      userName: userName,
      userEmail: userEmail,
      transportId: transport.id,
      type: transport.type,
      transportType: transport.type,
      departureCity: transport.departureCity,
      arrivalCity: transport.arrivalCity,
      departureTime: transport.departureTime,
      arrivalTime: transport.arrivalTime,
      price: transport.price,
      compagnie: transport.compagnie,
      seatNumber: `AUTO-${Math.floor(Math.random() * 1000)}`,
      reservationDate: new Date().toISOString(),
      paymentStatus: 'PENDING' as const,
      isWorldCupRoute: transport.isWorldCupRoute,
      matchDay: transport.matchDay,
      stadium: transport.stadium,
      ticketNumber: `WC2030-${Date.now()}`
    };

    this.transportService.createReservation(reservationData).subscribe({
      next: (reservation) => {
        // Décrémenter le nombre de places disponibles
        transport.place -= 1;
        this.reservingIds.delete(transport.id!);
        this.showSuccess(`Réservation effectuée avec succès ! Numéro de ticket: ${reservation.ticketNumber}`);
      },
      error: (error) => {
        this.reservingIds.delete(transport.id!);
        this.error = `Erreur lors de la réservation: ${error.message}`;
      }
    });
  }

  // Propriétés calculées pour le template
  get totalTransports(): number {
    return this.transports.length;
  }

  get worldCupTransports(): number {
    return this.transports.filter(t => this.isWorldCupRoute(t)).length;
  }

  get availableTransports(): number {
    return this.transports.filter(t => t.place > 0).length;
  }

  // Méthodes utilitaires pour le template
  refreshTransports() {
    this.loadTransports();
  }

  dismissMessage(type: 'success' | 'error') {
    if (type === 'success') {
      this.successMessage = null;
    } else {
      this.error = null;
    }
  }

  // Méthode pour gérer les valeurs de range de prix dans le template
  getPriceRangeValue(range: PriceRange): string {
    return range.min + '-' + (range.max === Infinity ? '999999' : range.max);
  }

  private showSuccess(message: string) {
    this.successMessage = message;
    this.error = null;
    setTimeout(() => {
      this.successMessage = null;
    }, 8000);
  }
}