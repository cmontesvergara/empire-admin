import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from './session-storage/session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsService {
  baseUrl = environment.baseUrl;
  constructor(
    private readonly http: HttpClient,
    private readonly sessionStorageService: SessionStorageService,
  ) {}

  getApplicationsVinculated() {
    return this.http.get(`${this.baseUrl}/api/v1/user/vinculate-applications`, {
      headers: {
        'x-access-token': this.sessionStorageService.getAccessToken() || '',
      },
    });
  }
  vinculateApplication(data: string) {
    return this.http.post(
      `${this.baseUrl}/api/v1/user/vinculate-applications`,
      { applicationId: data },
      {
        headers: {
          'x-access-token': this.sessionStorageService.getAccessToken() || '',
        },
      },
    );
  }
  checkSubscription() {
    return this.http.get<any>(
      `${this.baseUrl}/api/v1/user/check-subscription`,

      {
        headers: {
          'x-access-token': this.sessionStorageService.getAccessToken() || '',
        },
      },
    );
  }
}
