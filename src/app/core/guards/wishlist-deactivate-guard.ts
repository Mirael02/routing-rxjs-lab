import { Injectable, inject } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { WishlistService } from '../services/wishlist-service';

export interface WishlistComponentType {}

@Injectable({ providedIn: 'root' })
export class WishlistDeactivateGuard implements CanDeactivate<WishlistComponentType> {
  private wishlistService = inject(WishlistService);

  canDeactivate(): boolean {
    if (this.wishlistService.hasUnboughtItems()) {
      return confirm('Ada produk di wishlist yang belum Anda beli. Yakin ingin meninggalkan halaman?');
    }
    return true;
  }
}