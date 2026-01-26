import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

export const isLoggedGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    // Try to get profile with SSO cookie
    await firstValueFrom(authService.getProfile());
    return true;
  } catch (error) {
    // Cookie invalid or expired - redirect to login
    // Preserve the attempted URL for redirect after login
    router.navigate(['/auth/sign-in'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
};
