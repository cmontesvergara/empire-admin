import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const emailVerificationGuard: CanActivateFn = (route, state) => {
  // Check if userId is present in query params
  const router = inject(Router);
  const userId = route.queryParams['userId'];
  if (userId) {
    return true;
  }

    router.navigate(['/auth/sign-in']);
    return false;
};
