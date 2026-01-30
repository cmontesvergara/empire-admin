import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { SystemRole } from '../models';
import { AuthService } from '../services/auth/auth.service';

export const systemAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getProfile().pipe(
    map((response) => {
      // Allow access for super_admin and system_admin
      if (
        response.user.systemRole === SystemRole.SUPER_ADMIN ||
        response.user.systemRole === SystemRole.SYSTEM_ADMIN
      ) {
        return true;
      }

      // Redirect to dashboard if user doesn't have permission
      router.navigate(['/dashboard']);
      return false;
    }),
  );
};
