import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  private baseUrl = environment.baseUrl;

  constructor(private readonly http: HttpClient, private router: Router) {}

  getGenders() {
    return this.http.get(`${this.baseUrl}/api/v1/util/enums/genders`);
  }
  getCountries() {
    return this.http.get(`${this.baseUrl}/api/v1/util/enums/countries`);
  }
  getMaritalStatuses() {
    return this.http.get(`${this.baseUrl}/api/v1/util/enums/marital_statuses`);
  }
  goTo(key: 'login' | 'register') {
    switch (key) {
      case 'login':
        this.router.navigateByUrl('auth/sign-in');
        break;

      case 'register':
        this.router.navigateByUrl('auth/sign-up');
        break;

      default:
        break;
    }
  }
  getCurrentUrl() {
    return this.router.url;
  }
}
