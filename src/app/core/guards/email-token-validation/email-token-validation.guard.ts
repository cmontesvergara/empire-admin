import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const emailTokenValidationGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Check if token is present in query params
  const token = route.queryParams['token'];

  if (token) {
    return true;
  }

  // If no token, redirect to sign-in
  router.navigate(['/auth/sign-in']);
  return false;
};
