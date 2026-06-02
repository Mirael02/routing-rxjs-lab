import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html'
})
export class NavbarComponent {
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  count$ = this.cartService.itemCount$;
  isLoggedIn$ = this.authService.isLoggedIn$;

  logout() {
    this.authService.logout();
  }
}