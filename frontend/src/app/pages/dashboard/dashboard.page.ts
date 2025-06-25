import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../components/footer/footer.component';  
import{NavbarComponent} from '../../components/navbar/navbar.component'
@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.css']
})
export class DashboardPage {
  constructor() {
    console.log('DashboardPage chargé');
  }
}
