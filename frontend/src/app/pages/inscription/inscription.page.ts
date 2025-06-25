// src/app/pages/inscription/inscription.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Ajout important
import { ReactiveFormsModule } from '@angular/forms'; // Ajout important

@Component({
  selector: 'app-inscription-page',
  templateUrl: './inscription.page.html',
  styleUrls: ['./inscription.page.css'],
  standalone: true, // Marquer comme standalone
  imports: [CommonModule, ReactiveFormsModule] // Importer les modules nécessaires
})
export class InscriptionPage {
  registerForm: FormGroup;
  fieldFocus: { [key: string]: boolean } = {};
  buttonDown: { [key: string]: boolean } = {};

  countries = [
    { value: 'MA', name: 'Maroc' },
    { value: 'FR', name: 'France' },
    { value: 'ES', name: 'Espagne' },
    { value: 'DZ', name: 'Algérie' },
    { value: 'TN', name: 'Tunisie' },
    { value: 'BR', name: 'Brésil' },
    { value: 'PT', name: 'Portugal' }
  ];

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  setFocus(field: string, isFocused: boolean) {
    this.fieldFocus[field] = isFocused;
  }

  setButtonDown(button: string, isDown: boolean) {
    this.buttonDown[button] = isDown;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Formulaire soumis:', this.registerForm.value);
      // Logique d'inscription ici
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}