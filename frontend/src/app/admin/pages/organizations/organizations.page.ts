// src/app/admin/pages/organizations/organizations.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './organizations.page.html',
  styleUrls: ['./organizations.page.css']
})
export class OrganizationsPage {
  organizations = [
    { name: 'FIFA', role: 'Organisation mondiale du football' },
    { name: 'FRMF', role: 'Fédération Royale Marocaine de Football' },
    { name: 'Ministère du Tourisme', role: 'Partenaire logistique' }
  ];
}

