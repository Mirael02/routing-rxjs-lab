import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isLoggedIn$.pipe(
    take(1),
    map(isLoggedIn => {
      // Jika sudah login, izinkan akses
      if (isLoggedIn) {
        return true;
      }
      // Jika belum login, redirect ke halaman login dan simpan URL tujuan
      return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
      });
    })
  );
};