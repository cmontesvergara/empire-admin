import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStorageService } from '../../services/session-storage/session-storage.service';

export const logOutGuard: CanActivateFn = (route, state) => {
  const sessionStorageService = inject(SessionStorageService);
  sessionStorageService.removeAccessToken()
  const router = inject(Router)
  router.navigate(['/auth/sign-in']);
  return false;
};
