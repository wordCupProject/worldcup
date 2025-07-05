// src/app/admin/pages/transports/transports.page.ts
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


// Interfaces pour typer les données
interface Transport {
  id: number;
  name: string;
  match: string;
  date: string;
  type: string;
  company: string;
  busCount: number;
  capacity: number;
  totalSeats: number;
  departurePoint: string;
  departureTime: string;
  returnTime: string;
  price: number;
}

interface Bus {
  id: number;
  number: string;
  plate: string;
  driver: string;
  phone: string;
  reserved: number;
  capacity: number;
  status: 'confirmed' | 'pending';
}

interface Match {
  id: number;
  name: string;
  stadium: string;
  date: string;
}

@Component({
  selector: 'app-transports',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './transports.page.html',
  styleUrls: ['./transports.page.css'],
})
export class TransportsPage implements OnInit {
  // Formulaire de création de transport
  transportForm: FormGroup;
  
  // Données
  matches: Match[] = [
    {
      id: 1,
      name: 'Maroc vs Brésil',
      stadium: 'Stade Mohammed V, Casablanca',
      date: '15/06/2030'
    },
    {
      id: 2,
      name: 'Espagne vs Allemagne',
      stadium: 'Stade de Marrakech',
      date: '16/06/2030'
    },
    {
      id: 3,
      name: 'France vs Argentine',
      stadium: 'Stade de Tanger',
      date: '18/06/2030'
    }
  ];

  transports: Transport[] = [
    {
      id: 1,
      name: 'Navettes Stade Mohammed V',
      match: 'Maroc vs Brésil',
      date: '15/06/2030 - 18:00',
      type: 'Navette',
      company: 'CTM',
      busCount: 8,
      capacity: 50,
      totalSeats: 400,
      departurePoint: 'Place des Nations Unies, Casablanca',
      departureTime: '16:00',
      returnTime: '23:00',
      price: 25
    },
    {
      id: 2,
      name: 'Bus Spécial Stade de Marrakech',
      match: 'Espagne vs Allemagne',
      date: '16/06/2030 - 20:30',
      type: 'Bus',
      company: 'Casa Transport',
      busCount: 6,
      capacity: 50,
      totalSeats: 300,
      departurePoint: 'Gare routière CTM, Marrakech',
      departureTime: '18:30',
      returnTime: '23:45',
      price: 30
    }
  ];

  buses: Bus[] = [
    {
      id: 1,
      number: 'Bus 01',
      plate: 'CAS-1234',
      driver: 'Mohamed El Amrani',
      phone: '06 12 34 56 78',
      reserved: 42,
      capacity: 50,
      status: 'confirmed'
    },
    {
      id: 2,
      number: 'Bus 02',
      plate: 'CAS-5678',
      driver: 'Karim Benjelloun',
      phone: '06 87 65 43 21',
      reserved: 35,
      capacity: 50,
      status: 'confirmed'
    },
    {
      id: 3,
      number: 'Bus 03',
      plate: 'CAS-9012',
      driver: 'À affecter',
      phone: '-',
      reserved: 0,
      capacity: 50,
      status: 'pending'
    }
  ];

  selectedBusId: number = 1;
  searchTerm: string = '';

  constructor(private fb: FormBuilder) {
    // Initialisation du formulaire
    this.transportForm = this.fb.group({
      match: ['', Validators.required],
      type: ['Bus', Validators.required],
      company: ['', Validators.required],
      busCount: [1, [Validators.required, Validators.min(1)]],
      capacity: [50, [Validators.required, Validators.min(10)]],
      departurePoint: ['', Validators.required],
      departureTime: ['16:00', Validators.required],
      returnTime: ['23:00', Validators.required],
      price: [20, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    // Calcul initial du total des places
    this.calculateTotalSeats();
    
    // Écoute des changements sur les champs busCount et capacity
    this.transportForm.get('busCount')?.valueChanges.subscribe(() => this.calculateTotalSeats());
    this.transportForm.get('capacity')?.valueChanges.subscribe(() => this.calculateTotalSeats());
  }

  // Calcule le total des places
  calculateTotalSeats() {
    const busCount = this.transportForm.get('busCount')?.value || 0;
    const capacity = this.transportForm.get('capacity')?.value || 0;
    this.transportForm.patchValue({ totalSeats: busCount * capacity }, { emitEvent: false });
  }

  // Ajoute un nouveau transport
  addTransport() {
    if (this.transportForm.valid) {
      const formValue = this.transportForm.value;
      const selectedMatch = this.matches.find(m => m.id === formValue.match);
      
      const newTransport: Transport = {
        id: Date.now(),
        name: `${formValue.type} ${selectedMatch?.stadium}`,
        match: selectedMatch?.name || '',
        date: `${selectedMatch?.date} - 18:00`,
        type: formValue.type,
        company: formValue.company,
        busCount: formValue.busCount,
        capacity: formValue.capacity,
        totalSeats: formValue.busCount * formValue.capacity,
        departurePoint: formValue.departurePoint,
        departureTime: formValue.departureTime,
        returnTime: formValue.returnTime,
        price: formValue.price
      };

      this.transports.push(newTransport);
      this.transportForm.reset({
        type: 'Bus',
        busCount: 1,
        capacity: 50,
        departureTime: '16:00',
        returnTime: '23:00',
        price: 20
      });
    }
  }

  // Supprime un transport
  deleteTransport(id: number) {
    this.transports = this.transports.filter(t => t.id !== id);
  }

  // Filtre les transports par recherche
  get filteredTransports(): Transport[] {
    if (!this.searchTerm) return this.transports;
    return this.transports.filter(t => 
      t.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      t.match.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Gestion des bus
  deleteBus(id: number) {
    this.buses = this.buses.filter(b => b.id !== id);
  }

  // Sélection d'un bus pour le plan des places
  selectBus(id: number) {
    this.selectedBusId = id;
  }
}
