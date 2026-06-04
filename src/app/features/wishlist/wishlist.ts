import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist-service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wishlist.html'
})
export class WishlistComponent {
  private wishlistService = inject(WishlistService);
  
  // Ambil data langsung dari service sebagai Observable
  wishlist$ = this.wishlistService.wishlist$;

  // Fungsi untuk menghapus produk dari wishlist
  removeFromWishlist(product: any) {
    this.wishlistService.toggleWishlist(product);
  }
}