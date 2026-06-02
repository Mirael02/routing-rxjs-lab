import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Ambil data 'roles' yang disyaratkan dari konfigurasi route
  const requiredRoles = route.data['roles'] as Array<string> || [];
  
  // Cek apakah user saat ini memiliki role yang disyaratkan
  const hasAccess = requiredRoles.some(r => auth.hasRole(r));

  if (!hasAccess) {
    // Jika tidak punya akses, redirect ke not-found atau forbidden
    router.navigate(['/not-found']); 
    return false;
  }
  return true;
};