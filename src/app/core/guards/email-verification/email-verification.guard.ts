import { CanActivateFn } from '@angular/router';

export const emailVerificationGuard: CanActivateFn = (route, state) => {
  // Check if userId is present in query params
  const userId = route.queryParams['userId'];
  if (userId) {
    return true;
  }
  return false;
};
