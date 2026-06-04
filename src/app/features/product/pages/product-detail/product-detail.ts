import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { ProductService, ProductWithReviews } from '../../services/product';
import { CartService } from '../../../../core/services/cart';
import { WishlistService } from '../../../../core/services/wishlist-service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.html'
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  wishlistService = inject(WishlistService);

  isFavorite$!: Observable<boolean>;
  data$!: Observable<ProductWithReviews>;

  ngOnInit() {
    // Setup stream untuk mengambil detail produk beserta review
    this.data$ = this.route.paramMap.pipe(
      map(params => Number(params.get('id'))),
      distinctUntilChanged(),
      switchMap(id => this.productService.getDetailWithReviews(id))
    );

    // Setup stream untuk mengecek status wishlist produk ini
    this.isFavorite$ = this.route.paramMap.pipe(
      switchMap(params => this.wishlistService.isInWishlist(Number(params.get('id'))))
    );
  }

  addToCart(product: any) {
    this.cartService.addItem(product);
  }

  toggleWishlist(product: any) {
    this.wishlistService.toggleWishlist(product);
  }
}