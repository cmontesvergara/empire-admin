import { CanActivateFn } from '@angular/router';

export const emailVerificationGuard: CanActivateFn = (route, state) => {
  const { nit, password } = JSON.parse(sessionStorage.getItem('sign-data') || '{}');
  if (nit && password) {
    return true;
  }
  return false;
};
