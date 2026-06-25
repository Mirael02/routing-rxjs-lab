import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartService } from '../../../core/services/cart';
import { WishlistService } from '../../../core/services/wishlist-service';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, MatBadgeModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  public authService = inject(AuthService);

  navStats$: Observable<{ cart: number; wishlist: number }> = combineLatest([
    this.cartService.itemCount$,
    this.wishlistService.count$,
  ]).pipe(
    map(([cartCount, wishlistCount]) => ({ cart: cartCount, wishlist: wishlistCount }))
  );

  isLoggedIn$ = this.authService.isLoggedIn$;

  logout() {
    this.authService.logout();
  }
}
