// src/app/user/dashboard/dashboard.page.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Ajouté
import { CommonModule } from '@angular/common'; // Ajouté
import { IonicModule } from '@ionic/angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservationService, 
         HotelReservation, 
         TransportReservation, 
         Event } from '../../services/reservation.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.css'],
   standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
})
export class DashboardUserPage implements OnInit {
  hotelReservations: HotelReservation[] = [];
  transportReservations: TransportReservation[] = [];
  upcomingEvents: Event[] = [];
  userDropdownOpen = false;
  newHotelReservation = false;
  newTransportReservation = false;
  stats = {
    hotel: { count: 3, completion: 80 },
    transport: { count: 2, completion: 50 },
    tickets: { count: 5, completion: 90 }
  };

  // Formulaire pour nouvelle réservation
  newHotelForm: any = {
    hotel: '',
    date: '',
    rooms: 1,
    status: 'En attente'
  };

  newTransportForm: any = {
    type: 'Bus',
    from: '',
    to: '',
    date: '',
    passengers: 1,
    status: 'En attente'
  };

  constructor(private reservationService: ReservationService) { }

  ngOnInit(): void {
    this.loadReservations();
    this.loadEvents();
  }

  loadReservations() {
    this.reservationService.getHotelReservations().subscribe(reservations => {
      this.hotelReservations = reservations;
      this.stats.hotel.count = reservations.length;
    });

    this.reservationService.getTransportReservations().subscribe(reservations => {
      this.transportReservations = reservations;
      this.stats.transport.count = reservations.length;
    });
  }

  loadEvents() {
    this.reservationService.getUpcomingEvents().subscribe(events => {
      this.upcomingEvents = events;
    });
  }

  cancelHotelReservation(id: number) {
    this.reservationService.cancelHotelReservation(id).subscribe(() => {
      this.hotelReservations = this.hotelReservations.filter(r => r.id !== id);
      this.stats.hotel.count = this.hotelReservations.length;
    });
  }

  cancelTransportReservation(id: number) {
    this.reservationService.cancelTransportReservation(id).subscribe(() => {
      this.transportReservations = this.transportReservations.filter(r => r.id !== id);
      this.stats.transport.count = this.transportReservations.length;
    });
  }

  toggleNewHotelForm() {
    this.newHotelReservation = !this.newHotelReservation;
    if (this.newHotelReservation) {
      this.newTransportReservation = false;
    }
  }

  toggleNewTransportForm() {
    this.newTransportReservation = !this.newTransportReservation;
    if (this.newTransportReservation) {
      this.newHotelReservation = false;
    }
  }

  submitHotelReservation() {
    this.reservationService.addHotelReservation(this.newHotelForm).subscribe(reservation => {
      this.hotelReservations.push(reservation);
      this.stats.hotel.count = this.hotelReservations.length;
      this.newHotelForm = {
        hotel: '',
        date: '',
        rooms: 1,
        status: 'En attente'
      };
      this.newHotelReservation = false;
    });
  }

  submitTransportReservation() {
    this.reservationService.addTransportReservation(this.newTransportForm).subscribe(reservation => {
      this.transportReservations.push(reservation);
      this.stats.transport.count = this.transportReservations.length;
      this.newTransportForm = {
        type: 'Bus',
        from: '',
        to: '',
        date: '',
        passengers: 1,
        status: 'En attente'
      };
      this.newTransportReservation = false;
    });
  }
}