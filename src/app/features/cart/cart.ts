import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html'
})
export class CartComponent {
  cartService = inject(CartService);
  private router = inject(Router);

  isCheckingOut = false;

  updateQty(id: number, qty: number) {
    this.cartService.updateQuantity(id, qty);
  }

  removeItem(id: number) {
    this.cartService.removeItem(id);
  }

  checkout() {
    this.isCheckingOut = true;
    // Simulasi delay proses checkout 2 detik
    of(true).pipe(delay(2000)).subscribe(() => {
      this.cartService.clearCart();
      this.isCheckingOut = false;
      alert('Pesanan berhasil dibuat!');
      this.router.navigate(['/products']);
    });
  }
}