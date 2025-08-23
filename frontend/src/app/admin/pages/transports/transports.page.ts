// transports.page.ts - Version corrigée
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TransportService } from '../../../services/transport.service';
import { 
  TransportDTO, 
  TransportType,
  TRANSPORT_TYPES,
  TRANSPORT_TYPE_LABELS 
} from '../../../models/transport.models';

@Component({
  selector: 'app-transports',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './transports.page.html'
})
export class TransportsPage {

  transportForm: TransportDTO = {
    type: 'BUS' as TransportType,
    compagnie: '',
    capacite: 50,
    departureCity: '',
    arrivalCity: '',
    departureTime: '',
    arrivalTime: '',
    place: 1,
    price: 0
  };

  transports: TransportDTO[] = [];

  // Constantes pour le template
  transportTypes = TRANSPORT_TYPES;
  transportTypeLabels = TRANSPORT_TYPE_LABELS;

  constructor(private transportService: TransportService) {
    this.loadTransports();
  }

  loadTransports() {
    this.transportService.getAllTransports().subscribe({
      next: data => {
        this.transports = data;
        console.log('✅ Transports chargés:', data.length);
      },
      error: err => {
        console.error('❌ Erreur chargement transports:', err);
        alert('Erreur lors du chargement des transports');
      }
    });
  }

  addTransport() {
    // Validation avant envoi
    if (!this.isFormValid()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Conversion et préparation des données
    const transportData: TransportDTO = {
      ...this.transportForm,
      type: this.transportForm.type as TransportType,
      place: this.transportForm.capacite, // Initialiser places = capacité
      departureTime: this.formatDateTime(this.transportForm.departureTime),
      arrivalTime: this.formatDateTime(this.transportForm.arrivalTime)
    };

    console.log('📤 Envoi du transport:', transportData);

    // Vérifier si la méthode addTransport existe dans le service
    if (typeof this.transportService.addTransport !== 'function') {
      console.error('❌ La méthode addTransport n\'existe pas sur TransportService.');
      alert('La fonctionnalité d\'ajout de transport n\'est pas disponible.');
      return;
    }

    this.transportService.addTransport(transportData).subscribe({
      next: (res: TransportDTO) => {
        console.log('✅ Transport ajouté:', res);
        alert('Transport ajouté avec succès !');
        // Rechargez la liste pour éviter les doublons ou incohérences
        this.loadTransports();
        this.resetForm();
      },
      error: (err: any) => {
        console.error('❌ Erreur lors de l\'ajout:', err);
        alert(`Erreur lors de l'ajout: ${err.message || 'Erreur inconnue'}`);
      }
    });
  }

  // Validation du formulaire
  isFormValid(): boolean {
    return !!(
      this.transportForm.type &&
      this.transportForm.compagnie &&
      this.transportForm.departureCity &&
      this.transportForm.arrivalCity &&
      this.transportForm.departureTime &&
      this.transportForm.arrivalTime &&
      this.transportForm.capacite > 0 &&
      this.transportForm.price > 0
    );
  }

  // Formatage des dates pour le backend
  formatDateTime(dateTime: string): string {
    if (!dateTime) return '';
    
    try {
      // Convertir en format ISO si nécessaire
      const date = new Date(dateTime);
      return date.toISOString();
    } catch {
      return dateTime; // Retourner tel quel si erreur
    }
  }

  // Reset du formulaire avec valeurs par défaut
  resetForm() {
    this.transportForm = {
      type: 'BUS' as TransportType,
      compagnie: '',
      capacite: 50,
      departureCity: '',
      arrivalCity: '',
      departureTime: '',
      arrivalTime: '',
      place: 1,
      price: 0
    };
  }

  // Méthodes utilitaires pour le template
  getTransportTypeLabel(type: TransportType): string {
    return TRANSPORT_TYPE_LABELS[type] || type;
  }

  getTransportIcon(type: TransportType): string {
    const transport = TRANSPORT_TYPES.find(t => t.value === type);
    return transport?.icon || '🚗';
  }

  // Méthodes de formatage pour l'affichage
  formatDisplayDate(dateTime: string): string {
    try {
      const date = new Date(dateTime);
      return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateTime;
    }
  }

  formatPrice(price: number): string {
    return `${price.toLocaleString('fr-MA')} MAD`;
  }

  // Méthodes de gestion des transports existants
  editTransport(transport: TransportDTO) {
    // TODO: Implémenter l'édition
    console.log('Édition du transport:', transport.id);
  }

  deleteTransport(transport: TransportDTO) {
    if (!transport.id) return;
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer ce transport ?`)) {
      this.transportService.deleteTransport(transport.id as number).subscribe({
        next: (): void => {
          this.transports = this.transports.filter((t: TransportDTO) => t.id !== transport.id);
          alert('Transport supprimé avec succès');
        },
        error: (err: any): void => {
          console.error('Erreur suppression:', err);
          alert('Erreur lors de la suppression');
        }
      });
    }
  }

  viewTransport(transport: TransportDTO) {
    // TODO: Implémenter la vue détaillée
    console.log('Affichage du transport:', transport.id);
  }

  // Méthode pour valider la compatibilité des types
  onTypeChange(newType: string) {
    if (this.isValidTransportType(newType)) {
      this.transportForm.type = newType as TransportType;
    }
  }

  private isValidTransportType(type: string): type is TransportType {
    return ['PLANE', 'BUS', 'TRAIN', 'CAR'].includes(type);
  }
}