import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../../features/product/services/product';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private items$ = new BehaviorSubject<Product[]>([]);
  
  readonly wishlist$: Observable<Product[]> = this.items$.asObservable();
  readonly count$: Observable<number> = this.wishlist$.pipe(map(items => items.length));

  toggleWishlist(product: Product) {
    const current = this.items$.value;
    const exists = current.find(item => item.id === product.id);

    if (exists) {
      // Hapus jika sudah ada
      this.items$.next(current.filter(item => item.id !== product.id));
    } else {
      // Tambah jika belum ada
      this.items$.next([...current, product]);
    }
  }

  isInWishlist(productId: number): Observable<boolean> {
    return this.wishlist$.pipe(
      map(items => items.some(item => item.id === productId))
    );
  }

  hasUnboughtItems(): boolean {
    return this.items$.value.length > 0;
  }
}