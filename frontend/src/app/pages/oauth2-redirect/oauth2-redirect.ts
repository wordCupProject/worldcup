import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-oauth2-redirect',
  standalone: true,
  template: `
    <div class="p-10 text-center">
      <h2 class="text-2xl font-bold mb-4">Connexion réussie</h2>
      <p>Bonjour {{ firstName }} {{ lastName }} !</p>
      <p>Redirection en cours...</p>
    </div>
  `
})
export class Oauth2Redirect implements OnInit {
  firstName = '';
  lastName = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    this.firstName = this.route.snapshot.queryParamMap.get('firstName') || '';
    this.lastName = this.route.snapshot.queryParamMap.get('lastName') || '';

    if (token) {
      localStorage.setItem('token', token);
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
