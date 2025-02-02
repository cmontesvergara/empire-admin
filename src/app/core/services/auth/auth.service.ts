import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.baseUrl;
  constructor(private readonly http: HttpClient) {}

  signIn(nit: string, password: string) {
    return this.http.post(`${this.baseUrl}/api/v1/login`, {
      credentials: {
        nit,
        password,
      },
    });
  }
  signUp(values: any) {
    return this.http.post(`${this.baseUrl}/api/v1/user/create`, values);
  }

  sendEmailOtpCode(nit: string) {
    return this.http.post(
      `${this.baseUrl}/api/v1/verify/send_email_code`,
      {
        credentials: {
          nit
        }
      },
    );
  }
  validateEmailOtpCode(nit: string, code: string) {
    return this.http.post(`${this.baseUrl}/api/v1/verify/email_code`, {
      credentials: {
        nit,
      },
      code
    });
  }
}
