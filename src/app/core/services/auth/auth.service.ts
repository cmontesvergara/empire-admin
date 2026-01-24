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
    return this.http.post(`${this.baseUrl}/api/v1/auth/signin`, {
      nuid: nit,
      password,
    });
  }
  signUp(values: any) {
    return this.http.post(`${this.baseUrl}/api/v1/auth/signup`, values);
  }

  sendEmailOtpCode(email: string, userId: string) {
    return this.http.post(`${this.baseUrl}/api/v1/email-verification/send`, {
      email,
      userId: userId
    });
  }
  validateEmailRecovery(newPassword: string, otp: string) {
    return this.http.post(
      `${this.baseUrl}/api/v1/verify/validate_email_recovery`,
      {
        newPassword,
        otp,
      },
    );
  }
  sendEmailRecovery(nit: string) {
    return this.http.post(`${this.baseUrl}/api/v1/verify/send_email_recovery`, {
      credentials: {
        nit,
      },
    });
  }
  validateEmailOtpCode(nit: string, code: string) {
    return this.http.post(`${this.baseUrl}/api/v1/verify/email_code`, {
      credentials: {
        nit,
      },
      code,
    });
  }

  verifyEmailToken(token: string) {
    return this.http.post(`${this.baseUrl}/api/v1/email-verification/verify`, {
      token,
    });
  }

  generateOTP(userId: string, name: string) {
    return this.http.post(`${this.baseUrl}/api/v1/otp/generate`, {
      userId,
      name,
    });
  }

  verifyOTP(userId: string, token: string) {
    return this.http.post(`${this.baseUrl}/api/v1/otp/verify`, {
      userId,
      token,
    });
  }

  validateOTP(tempToken: string, token: string) {
    return this.http.post(`${this.baseUrl}/api/v1/otp/validate`, {
      tempToken,
      token,
    });
  }

  checkOTPStatus(userId: string) {
    return this.http.get(`${this.baseUrl}/api/v1/otp/status/${userId}`);
  }
}
