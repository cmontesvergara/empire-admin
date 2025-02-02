import { CanActivateFn } from '@angular/router';

export const emailVerificationGuard: CanActivateFn = (route, state) => {
  const nit = sessionStorage.getItem('sign-in-nit');
  const pass = sessionStorage.getItem('sign-in-pass');
  if (nit && pass) {

    return true;
  }
  return false;
};
