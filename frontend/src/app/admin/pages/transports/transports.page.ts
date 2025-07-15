import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TransportService } from '../../../services/transport.service';

export interface TransportDTO {
  id?: number;
  type: string;
  compagnie: string;
  capacite: number;
  departureCity: string;
  arrivalCity: string;
  departureTime: string; // ISO string
  arrivalTime: string;
  place: number;         // ou string si tu changes backend
  price: number;
}

@Component({
  selector: 'app-transports',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './transports.page.html'
})
export class TransportsPage {

  transportForm: TransportDTO = {
    type: '',
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

  constructor(private transportService: TransportService) {
    this.loadTransports();
  }

  loadTransports() {
    this.transportService.getAllTransports().subscribe({
      next: data => this.transports = data,
      error: err => console.error('Erreur chargement transports :', err)
    });
  }

  addTransport() {
    this.transportService.addTransport(this.transportForm).subscribe({
      next: res => {
        alert('Transport ajouté avec succès !');
        this.transports.push(res);
        this.resetForm();
      },
      error: err => {
        console.error('Erreur lors de l\'ajout :', err);
        alert('Erreur lors de l\'ajout.');
      }
    });
  }

  resetForm() {
    this.transportForm = {
      type: '',
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
}
