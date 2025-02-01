import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const logOutGuard: CanActivateFn = (route, state) => {
  sessionStorage.removeItem('access_token');
  const router = inject(Router)
    router.navigate(['/home']);
  return false;
};
