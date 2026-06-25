import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartService } from '../../core/services/cart';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { NotificationService } from '../../core/services/notification';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule, MatProgressSpinnerModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class CartComponent {
  cartService = inject(CartService);
  private router = inject(Router);
  private notif = inject(NotificationService);

  isCheckingOut = false;

  updateQty(id: number, qty: number) {
    this.cartService.updateQuantity(id, qty);
  }

  removeItem(id: number) {
    this.cartService.removeItem(id);
  }

  checkout() {
    this.isCheckingOut = true;
    of(true)
      .pipe(delay(2000))
      .subscribe(() => {
        this.cartService.clearCart();
        this.isCheckingOut = false;
        this.notif.show('Pesanan berhasil dibuat!');
        this.router.navigate(['/products']);
      });
  }
}
