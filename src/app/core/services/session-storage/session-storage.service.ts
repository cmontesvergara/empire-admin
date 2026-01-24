import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  keys = {
    lastUrl: 'LAST_URL_KEY',
    accessToken: 'x-access-token',
    refreshToken: 'x-refresh-token',
    signData: 'x-sign-data',
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
  saveRefreshToken(payload: string) {
    sessionStorage.setItem(this.keys.refreshToken, payload);
  }
  getAccessToken() {
    return  sessionStorage.getItem(this.keys.accessToken) ;
  }
  getRefreshToken() {
    return  sessionStorage.getItem(this.keys.refreshToken) ;
  }
  removeAccessToken() {
    sessionStorage.removeItem(this.keys.accessToken);
  }
  removeRefreshToken() {
    sessionStorage.removeItem(this.keys.refreshToken);
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
