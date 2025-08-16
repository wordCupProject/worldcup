import { Component, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.css']
})
export class NavbarAdminComponent {
  menuOpen = false;       // menu Admin complet
  langOpen = false;       // sous-menu Langue

  selectedLanguage = { code: 'fr', label: 'Français', flag: '🇫🇷' };

  languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇲🇦' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' }
  ];

  constructor(private eRef: ElementRef) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    if (!this.menuOpen) this.langOpen = false; // fermer sous-menu si Admin fermé
  }

  toggleLangMenu() {
    this.langOpen = !this.langOpen;
  }

  selectLanguage(lang: any) {
    this.selectedLanguage = lang;
    this.langOpen = false;  // fermer sous-menu après sélection
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.menuOpen = false;
      this.langOpen = false;
    }
  }
}
