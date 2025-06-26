// src/app/pages/login/login.page.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import ajouté
import { ReactiveFormsModule } from '@angular/forms'; // Import ajouté

@Component({
  selector: 'app-login-page',
  standalone: true, // Composant standalone
  imports: [CommonModule, ReactiveFormsModule], // Modules importés ici
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css']
})
export class LoginPage {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      // Simuler un appel API
      setTimeout(() => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      }, 1500);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  loginWithProvider(provider: string) {
    console.log(`Connexion avec ${provider}`);
    this.router.navigate(['/dashboard']);
  }
}