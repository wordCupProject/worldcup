import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

interface Admin {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  password: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  avatar: {
    initials: string;
    bgColor: string;
    textColor: string;
  };
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
  borderColor: string;
}

interface Permission {
  name: string;
  granted: boolean;
}

@Component({
  selector: 'app-admins',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  templateUrl: './admins.page.html',
  styleUrls: ['./admins.page.css']
})
export class AdminsPage implements OnInit {
  adminForm: FormGroup;
  admins: Admin[] = [];
  roles: Role[] = [];
  searchTerm: string = '';
  showPassword: boolean = false;
  countries: string[] = ['Maroc', 'France', 'Algérie', 'Tunisie', 'Espagne', 'Autre'];
  isEditing: boolean = false;
  currentAdminId: number | null = null;

  constructor(private fb: FormBuilder) {
    this.adminForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern('^[0-9]{10}$')]],
      country: ['Maroc', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['Administrateur', Validators.required],
      status: ['active', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSampleData();
  }

  loadSampleData(): void {
    // Sample admins
    this.admins = [
      {
        id: 1,
        firstName: 'Ahmed',
        lastName: 'Benali',
        email: 'ahmed@example.com',
        phone: '0612345678',
        country: 'Maroc',
        password: 'password123',
        role: 'Administrateur',
        status: 'active',
        avatar: {
          initials: 'AB',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800'
        }
      },
      {
        id: 2,
        firstName: 'Fatima',
        lastName: 'Zahra',
        email: 'fatima@example.com',
        phone: '0623456789',
        country: 'Maroc',
        password: 'password123',
        role: 'Éditeur',
        status: 'active',
        avatar: {
          initials: 'FZ',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800'
        }
      },
      {
        id: 3,
        firstName: 'Karim',
        lastName: 'Moussa',
        email: 'karim@example.com',
        phone: '0634567890',
        country: 'France',
        password: 'password123',
        role: 'Modérateur',
        status: 'inactive',
        avatar: {
          initials: 'KM',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800'
        }
      },
      {
        id: 4,
        firstName: 'Sara',
        lastName: 'Amrani',
        email: 'sara@example.com',
        phone: '0645678901',
        country: 'Algérie',
        password: 'password123',
        role: 'Support',
        status: 'active',
        avatar: {
          initials: 'SA',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800'
        }
      }
    ];

    // Sample roles
    this.roles = [
      {
        id: 1,
        name: 'Administrateur',
        description: 'Accès complet au système',
        borderColor: 'border-blue-500',
        permissions: [
          { name: 'Gestion complète des utilisateurs', granted: true },
          { name: 'Configuration du système', granted: true },
          { name: 'Accès à tous les modules', granted: true },
          { name: 'Création de rôles', granted: true }
        ]
      },
      {
        id: 2,
        name: 'Éditeur',
        description: 'Gestion du contenu',
        borderColor: 'border-purple-500',
        permissions: [
          { name: 'Gestion des hôtels', granted: true },
          { name: 'Gestion des transports', granted: true },
          { name: 'Modification des contenus', granted: true },
          { name: "Création d'articles", granted: true }
        ]
      },
      {
        id: 3,
        name: 'Modérateur',
        description: 'Modération du contenu',
        borderColor: 'border-yellow-500',
        permissions: [
          { name: 'Modération des commentaires', granted: true },
          { name: 'Signalement des abus', granted: true },
          { name: 'Gestion des utilisateurs', granted: false },
          { name: 'Accès aux rapports', granted: true }
        ]
      }
    ];
  }

  initAdminForm(admin?: Admin): void {
    if (admin) {
      this.adminForm.patchValue({
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phone: admin.phone,
        country: admin.country,
        password: admin.password,
        role: admin.role,
        status: admin.status
      });
      this.isEditing = true;
      this.currentAdminId = admin.id;
    } else {
      this.adminForm.reset({
        country: 'Maroc',
        role: 'Administrateur',
        status: 'active'
      });
      this.isEditing = false;
      this.currentAdminId = null;
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  saveAdmin(): void {
    if (this.adminForm.valid) {
      const formValue = this.adminForm.value;
      const initials = `${formValue.firstName[0]}${formValue.lastName[0]}`.toUpperCase();
      
      // Determine avatar colors based on role
      let bgColor = 'bg-gray-100';
      let textColor = 'text-gray-800';
      
      switch (formValue.role) {
        case 'Administrateur':
          bgColor = 'bg-blue-100';
          textColor = 'text-blue-800';
          break;
        case 'Éditeur':
          bgColor = 'bg-purple-100';
          textColor = 'text-purple-800';
          break;
        case 'Modérateur':
          bgColor = 'bg-green-100';
          textColor = 'text-green-800';
          break;
        case 'Support':
          bgColor = 'bg-red-100';
          textColor = 'text-red-800';
          break;
      }
      
      const adminData: Admin = {
        id: this.currentAdminId || Date.now(),
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        phone: formValue.phone,
        country: formValue.country,
        password: formValue.password,
        role: formValue.role,
        status: formValue.status,
        avatar: {
          initials,
          bgColor,
          textColor
        }
      };
      
      if (this.isEditing && this.currentAdminId) {
        // Update existing admin
        const index = this.admins.findIndex(a => a.id === this.currentAdminId);
        if (index !== -1) {
          this.admins[index] = adminData;
        }
      } else {
        // Add new admin
        this.admins.unshift(adminData);
      }
      
      this.adminForm.reset({
        country: 'Maroc',
        role: 'Administrateur',
        status: 'active'
      });
      this.isEditing = false;
      this.currentAdminId = null;
    }
  }

  deleteAdmin(id: number): void {
    this.admins = this.admins.filter(admin => admin.id !== id);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'suspended': return 'Suspendu';
      default: return 'Inconnu';
    }
  }

  addRole(): void {
    const newRole: Role = {
      id: Date.now(),
      name: 'Nouveau Rôle',
      description: 'Description du nouveau rôle',
      borderColor: 'border-gray-500',
      permissions: [
        { name: 'Permission 1', granted: false },
        { name: 'Permission 2', granted: false }
      ]
    };
    this.roles.push(newRole);
  }

  editRole(role: Role): void {
    // Logic to edit role
    alert(`Modification du rôle: ${role.name}`);
  }

  deleteRole(id: number): void {
    this.roles = this.roles.filter(role => role.id !== id);
  }
}