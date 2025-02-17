import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStorageService } from '../../services/session-storage/session-storage.service';

export const isLoggedGuard: CanActivateFn = (route, state) => {
  const sessionStorageService  = inject(SessionStorageService);
  const access_token = sessionStorageService.getAccessToken();
  if (access_token && access_token.split('.').length === 3) {
    return true;
  }
  const router = inject(Router)
  router.navigate(['/home/welcome']);
  return false;
};
