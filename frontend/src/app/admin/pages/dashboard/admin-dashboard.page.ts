// src/app/admin/pages/admin-dashboard/admin-dashboard.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBuilding, faBus, faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.css']
})
export class AdminDashboardPage {
  faBuilding = faBuilding;
  faBus = faBus;
  faUsers = faUsers;
  
  stats = [
    { title: 'Hôtels', value: 128, icon: faBuilding, color: 'bg-blue-500' },
    { title: 'Transports', value: 42, icon: faBus, color: 'bg-green-500' },
    { title: 'Organisations', value: 56, icon: faUsers, color: 'bg-purple-500' }
  ];
}

