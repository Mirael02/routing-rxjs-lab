import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { 
    path: 'home', 
    loadComponent: () => import('./pages/home/home').then(c => c.Home) 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login').then(c => c.LoginComponent) 
  },
  { 
    path: 'not-found', 
    loadComponent: () => import('./pages/not-found/not-found').then(c => c.NotFound) 
  },
  { 
    path: 'products', 
    loadChildren: () => import('./features/product/product-module').then(m => m.ProductModule),
    canActivate: [authGuard] 
  },
  { 
    path: 'cart', 
    loadComponent: () => import('./features/cart/cart').then(c => c.CartComponent) 
  },
  { 
    path: 'admin', 
    loadChildren: () => import('./features/admin/admin-module').then(m => m.AdminModule),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] } 
  },
  { path: '**', redirectTo: '/not-found' }
];