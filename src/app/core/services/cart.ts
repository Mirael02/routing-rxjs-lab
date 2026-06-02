import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationService } from './notification';
import { inject } from '@angular/core';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  // State utama (private, hanya bisa diubah dari dalam service ini)
  private items$ = new BehaviorSubject<CartItem[]>([]);
  private isLoading$ = new BehaviorSubject<boolean>(false);
  private notifs$ = new Subject<string>();

  // State publik (readonly, untuk dibaca oleh komponen)
  readonly cart$ = this.items$.asObservable();
  readonly loading$ = this.isLoading$.asObservable();
  readonly notifications$ = this.notifs$.asObservable();

  // Data turunan yang otomatis terhitung ketika items$ berubah
  readonly itemCount$ = this.cart$.pipe(
    map(items => items.reduce((sum, i) => sum + i.quantity, 0))
  );

  readonly subtotal$ = this.cart$.pipe(
    map(items => items.reduce((sum, i) => sum + i.price * i.quantity, 0))
  );

  readonly isEmpty$ = this.itemCount$.pipe(map(n => n === 0));

  addItem(product: any) {
    const current = this.items$.value;
    const existing = current.find(i => i.id === product.id);

    if (existing) {
      this.items$.next(
        current.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      );
      this.notify(`${product.title} jumlah ditambah`);
    } else {
      this.items$.next([...current, { ...product, quantity: 1 }]);
      this.notify(`${product.title} ditambahkan ke keranjang`);
    }
  }

  removeItem(id: number) {
    this.items$.next(this.items$.value.filter(i => i.id !== id));
  }

  updateQuantity(id: number, qty: number) {
    if (qty <= 0) {
      this.removeItem(id);
      return;
    }
    this.items$.next(
      this.items$.value.map(i => i.id === id ? { ...i, quantity: qty } : i)
    );
  }

  clearCart() {
    this.items$.next([]);
  }

  private notify(msg: string) {
    this.notifs$.next(msg);
  }

  constructor() {
    const notifSvc = inject(NotificationService);
    // Setiap kali ada event notifs$ memancarkan pesan, teruskan ke NotificationService
    this.notifications$.subscribe(msg => notifSvc.show(msg));
  }
}