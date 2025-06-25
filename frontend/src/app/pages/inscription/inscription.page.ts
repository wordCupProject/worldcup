// src/app/pages/inscription/inscription.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService, RegisterPayload } from '../../services/auth.service';

@Component({
  selector: 'app-inscription-page',
  standalone: true,
  imports: [  CommonModule,
    ReactiveFormsModule ],
  templateUrl: './inscription.page.html',
  styleUrls: ['./inscription.page.css']
})
export class InscriptionPage {
  registerForm: FormGroup;
  fieldFocus:   { [key: string]: boolean } = {};
  buttonDown:   { [key: string]: boolean } = {};

  countries = [
    { value: 'MA', name: 'Maroc' },
    // ...
  ];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService
  ) {
    this.registerForm = this.fb.group({
      firstName:       ['', Validators.required],
      lastName:        ['', Validators.required],
      email:           ['', [Validators.required, Validators.email]],
      phone:           ['', Validators.required],
      country:         ['', Validators.required],
      password:        ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      terms:           [false, Validators.requiredTrue]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')!.value === form.get('confirmPassword')!.value
      ? null : { mismatch: true };
  }

  setFocus(field: string, isFocused: boolean) {
    this.fieldFocus[field] = isFocused;
  }

  setButtonDown(btn: string, down: boolean) {
    this.buttonDown[btn] = down;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const payload: RegisterPayload = {
      firstName: this.registerForm.value.firstName,
      lastName:  this.registerForm.value.lastName,
      email:     this.registerForm.value.email,
      phone:     this.registerForm.value.phone,
      country:   this.registerForm.value.country,
      password:  this.registerForm.value.password,
    };

    this.auth.register(payload).subscribe({
      next: res => {
        alert(res.message);      // ou rediriger vers /login
      },
      error: err => {
        alert(err.error?.message || 'Une erreur est survenue');
      }
    });
  }
}
