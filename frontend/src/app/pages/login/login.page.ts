// src/app/pages/login/login.page.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // ✅ importe le service
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule], // ✅ HttpClientModule est utile ici
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css']
})
export class LoginPage {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService // ✅ injecte ici
  ) {
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
      const loginData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.login({
  email: this.loginForm.value.email,
  password: this.loginForm.value.password
}).subscribe({
  next: (res) => {
    localStorage.setItem('token', res.token!); // le `!` indique que `token` est non-null
    this.router.navigate(['/inscription']);
  },
  error: (err) => {
    alert(err.error.message || 'Email ou mot de passe incorrect');
  }
});

    } else {
      this.loginForm.markAllAsTouched();
    }
  }

loginWithProvider(provider: string) {
  if (provider === 'google') {
    // Redirection vers le backend Spring Boot (OAuth2 login)
    window.location.href = 'http://localhost:8081/oauth2/authorization/google';
  }
}

}
