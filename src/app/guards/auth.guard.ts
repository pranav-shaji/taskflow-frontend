import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const loggedIn = authService.isLoggedIn();

  console.log('GUARD CHECK - isLoggedIn:', loggedIn);

  return loggedIn
    ? true
    : router.createUrlTree(['/login']);
};