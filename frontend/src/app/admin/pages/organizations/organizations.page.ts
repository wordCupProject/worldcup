
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';







// Interface pour typer les données des organisations
interface Organization {
  id: number;
  name: string;
  type: 'hotel' | 'transport';
  city: string;
  capacity: string;
  status: 'active' | 'pending';
  description: string;
  services: string[];
  rating?: string;
  category?: string;
  imageUrl: string;
}

@Component({
   selector: 'app-organizations',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './organizations.page.html',
  styleUrls: ['./organizations.page.css'],
})
export class OrganizationsPage implements OnInit {
  organizationForm: FormGroup;
  organizations: Organization[] = [];
  cities: string[] = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir'];
  services: string[] = ['Wi-Fi', 'Parking', 'Restaurant', 'Piscine'];
  selectedImage: File | null = null;
  previewImage: string | ArrayBuffer | null = null;


  // Exemples d'organisations
  sampleOrganizations: Organization[] = [
    {
      id: 1,
      name: 'Kenzi Tower',
      type: 'hotel',
      city: 'Casablanca',
      capacity: '320 chambres',
      status: 'active',
      description: '',
      services: [],
      rating: '5 étoiles',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 2,
      name: 'CTM Voyageurs',
      type: 'transport',
      city: 'National',
      capacity: '50 places',
      status: 'active',
      description: '',
      services: [],
      category: 'Bus VIP',
      imageUrl: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 3,
      name: 'Sofitel Rabat',
      type: 'hotel',
      city: 'Rabat',
      capacity: '250 chambres',
      status: 'pending',
      description: '',
      services: [],
      rating: '5 étoiles',
      imageUrl: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 4,
      name: 'ONCF Train',
      type: 'transport',
      city: 'National',
      capacity: '500 places',
      status: 'active',
      description: '',
      services: [],
      category: 'Train grande vitesse',
      imageUrl: 'https://images.unsplash.com/photo-1601000938251-4c5d1a1a7f7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    }
  ];

  constructor(private fb: FormBuilder) {
    // Initialisation du formulaire
    this.organizationForm = this.fb.group({
      type: ['hotel', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      city: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      description: ['', Validators.maxLength(500)],
      services: this.fb.group({
        'Wi-Fi': [false],
        'Parking': [false],
        'Restaurant': [false],
        'Piscine': [false]
      })
    });
  }

  ngOnInit() {
    // Initialiser avec les exemples
    this.organizations = [...this.sampleOrganizations];
  }

  // Gestion de la sélection d'image
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      
      // Créer une prévisualisation
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Soumission du formulaire
  addOrganization() {
    if (this.organizationForm.valid) {
      const formValue = this.organizationForm.value;
      
      // Récupérer les services sélectionnés
      const selectedServices = Object.entries(formValue.services)
        .filter(([_, value]) => value)
        .map(([key, _]) => key);
      
      // Créer la nouvelle organisation
      const newOrganization: Organization = {
        id: Date.now(),
        name: formValue.name,
        type: formValue.type,
        city: formValue.city,
        capacity: formValue.type === 'hotel' 
          ? `${formValue.capacity} chambres` 
          : `${formValue.capacity} places`,
        status: 'pending',
        description: formValue.description,
        services: selectedServices,
        imageUrl: this.previewImage?.toString() || 
          (formValue.type === 'hotel' 
            ? 'assets/default-hotel.jpg' 
            : 'assets/default-transport.jpg')
      };

      // Ajouter à la liste
      this.organizations.unshift(newOrganization);
      
      // Réinitialiser le formulaire
      this.organizationForm.reset({
        type: 'hotel',
        services: {
          'Wi-Fi': false,
          'Parking': false,
          'Restaurant': false,
          'Piscine': false
        }
      });
      
      // Réinitialiser l'image
      this.previewImage = null;
      this.selectedImage = null;
    }
  }

  // Supprimer une organisation
  deleteOrganization(id: number) {
    this.organizations = this.organizations.filter(org => org.id !== id);
  }

  // Rafraîchir la liste
  refreshOrganizations() {
    this.organizations = [...this.sampleOrganizations];
  }

  // Obtenir le texte du statut
  getStatusText(status: 'active' | 'pending'): string {
    return status === 'active' ? 'Actif' : 'En attente';
  }

  // Obtenir la classe CSS du statut
  getStatusClass(status: 'active' | 'pending'): string {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  }
}


  // Exemples d'organisations
  sampleOrganizations: Organization[] = [
    {
      id: 1,
      name: 'Kenzi Tower',
      type: 'hotel',
      city: 'Casablanca',
      capacity: '320 chambres',
      status: 'active',
      description: '',
      services: [],
      rating: '5 étoiles',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 2,
      name: 'CTM Voyageurs',
      type: 'transport',
      city: 'National',
      capacity: '50 places',
      status: 'active',
      description: '',
      services: [],
      category: 'Bus VIP',
      imageUrl: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 3,
      name: 'Sofitel Rabat',
      type: 'hotel',
      city: 'Rabat',
      capacity: '250 chambres',
      status: 'pending',
      description: '',
      services: [],
      rating: '5 étoiles',
      imageUrl: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 4,
      name: 'ONCF Train',
      type: 'transport',
      city: 'National',
      capacity: '500 places',
      status: 'active',
      description: '',
      services: [],
      category: 'Train grande vitesse',
      imageUrl: 'https://images.unsplash.com/photo-1601000938251-4c5d1a1a7f7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    }
  ];

  constructor(private fb: FormBuilder) {
    // Initialisation du formulaire
    this.organizationForm = this.fb.group({
      type: ['hotel', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      city: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      description: ['', Validators.maxLength(500)],
      services: this.fb.group({
        'Wi-Fi': [false],
        'Parking': [false],
        'Restaurant': [false],
        'Piscine': [false]
      })
    });
  }

  ngOnInit() {
    // Initialiser avec les exemples
    this.organizations = [...this.sampleOrganizations];
  }

  // Gestion de la sélection d'image
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      
      // Créer une prévisualisation
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Soumission du formulaire
  addOrganization() {
    if (this.organizationForm.valid) {
      const formValue = this.organizationForm.value;
      
      // Récupérer les services sélectionnés
      const selectedServices = Object.entries(formValue.services)
        .filter(([_, value]) => value)
        .map(([key, _]) => key);
      
      // Créer la nouvelle organisation
      const newOrganization: Organization = {
        id: Date.now(),
        name: formValue.name,
        type: formValue.type,
        city: formValue.city,
        capacity: formValue.type === 'hotel' 
          ? `${formValue.capacity} chambres` 
          : `${formValue.capacity} places`,
        status: 'pending',
        description: formValue.description,
        services: selectedServices,
        imageUrl: this.previewImage?.toString() || 
          (formValue.type === 'hotel' 
            ? 'assets/default-hotel.jpg' 
            : 'assets/default-transport.jpg')
      };

      // Ajouter à la liste
      this.organizations.unshift(newOrganization);
      
      // Réinitialiser le formulaire
      this.organizationForm.reset({
        type: 'hotel',
        services: {
          'Wi-Fi': false,
          'Parking': false,
          'Restaurant': false,
          'Piscine': false
        }
      });
      
      // Réinitialiser l'image
      this.previewImage = null;
      this.selectedImage = null;
    }
  }

  // Supprimer une organisation
  deleteOrganization(id: number) {
    this.organizations = this.organizations.filter(org => org.id !== id);
  }

  // Rafraîchir la liste
  refreshOrganizations() {
    this.organizations = [...this.sampleOrganizations];
  }

  // Obtenir le texte du statut
  getStatusText(status: 'active' | 'pending'): string {
    return status === 'active' ? 'Actif' : 'En attente';
  }

  // Obtenir la classe CSS du statut
  getStatusClass(status: 'active' | 'pending'): string {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  }
}