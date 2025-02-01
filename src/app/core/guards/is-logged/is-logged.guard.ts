import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const isLoggedGuard: CanActivateFn = (route, state) => {
  const access_token = sessionStorage.getItem('access_token');
  if (access_token && access_token.split('.').length === 3) {
    return true;
  }
  const router = inject(Router)
  router.navigate(['/home/welcome']);
  return false;
};
