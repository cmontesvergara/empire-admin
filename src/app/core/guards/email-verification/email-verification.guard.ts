import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { SessionStorageService } from '../../services/session-storage/session-storage.service';

export const emailVerificationGuard: CanActivateFn = (route, state) => {
  const sessionStorageService = inject(SessionStorageService);
  const { nit, password } = sessionStorageService.getSignData() ;
  if (nit && password) {
    return true;
  }
  return false;
};
