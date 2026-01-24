import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const twoFactorTokenGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const isValidating = route.queryParams['validate'] === 'true';
  const token = route.queryParams['token'];
  const userId = route.queryParams['userId'];
  const name = route.queryParams['name'];

  // Si está en modo validación, debe tener el token
  if (isValidating && !token) {
    router.navigate(['/auth/sign-in']);
    return false;
  }

  // Si está en modo setup, debe tener userId y name
  if (!isValidating && (!userId || !name)) {
    router.navigate(['/auth/sign-in']);
    return false;
  }

  return true;
};
