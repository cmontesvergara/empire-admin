import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  private baseUrl = environment.baseUrl;

  constructor(private readonly http: HttpClient) {}

  getGenders() {
    return this.http.get(`${this.baseUrl}/api/v1/util/enums/genders`);
  }
  getCountries() {
    return this.http.get(`${this.baseUrl}/api/v1/util/enums/countries`);
  }
  getMaritalStatuses() {
    return this.http.get(`${this.baseUrl}/api/v1/util/enums/marital_statuses`);
  }
}
