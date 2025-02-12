import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  REMEMBER_LOGIN_CREDENTENTIALS = 'remember-login-credentials';

  constructor() {}

  getRememberLoginCredentials() {
    const credentials = localStorage.getItem(
      this.REMEMBER_LOGIN_CREDENTENTIALS,
    );
    if (credentials) {
      return {nit:JSON.parse(credentials).nit , password: atob( JSON.parse(credentials).password)}
    } else {
      return null;
    }
  }
  setRememberLoginCredentials(payload: any) {
    localStorage.setItem(
      this.REMEMBER_LOGIN_CREDENTENTIALS,JSON.stringify({...payload, password: btoa(payload.password)}),
    );
  }

  removeRememberLoginCredentials() {
    localStorage.removeItem(
      this.REMEMBER_LOGIN_CREDENTENTIALS
    );
  }
}
