import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { WishlistGuard } from './core/guards/wishlist-guard';
import { WishlistDeactivateGuard } from './core/guards/wishlist-deactivate-guard';
import { WishlistService } from './core/services/wishlist-service';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
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
  {
    path: 'wishlist',
    loadComponent: () => import('./features/wishlist/wishlist').then(c => c.WishlistComponent)
  },
  { 
    path: 'wishlist', 
    component: WishlistService,
    canActivate: [WishlistGuard],
    canDeactivate: [WishlistDeactivateGuard]
  },
  { path: '**', redirectTo: '/not-found' }
];