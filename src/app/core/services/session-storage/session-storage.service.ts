import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  keys = {
    lastUrl: 'LAST_URL_KEY',
    accessToken: 'x-aceess-token',
    signData: 'x-aceess-token',
  };

  constructor() {}

  saveLastUrl(payload: string) {
    sessionStorage.setItem(this.keys.lastUrl, payload);
  }
  getLastUrl() {
    return sessionStorage.getItem(this.keys.lastUrl) ;
  }
  removeLastUrl() {
    sessionStorage.removeItem(this.keys.lastUrl);
  }
  saveAccessToken(payload: string) {
    sessionStorage.setItem(this.keys.accessToken, payload);
  }
  getAccessToken() {
    return  sessionStorage.getItem(this.keys.accessToken) ;
  }
  removeAccessToken() {
    sessionStorage.removeItem(this.keys.accessToken);
  }
  saveSignData(payload: any) {
    sessionStorage.setItem(this.keys.signData, JSON.stringify(payload));
  }
  getSignData() {
    return JSON.parse(sessionStorage.getItem(this.keys.signData) || '{}');
  }
  removeSignData() {
    sessionStorage.removeItem(this.keys.signData);
  }
}
