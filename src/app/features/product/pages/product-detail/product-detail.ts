import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { map, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { ProductService, ProductWithReviews } from '../../services/product';
import { CartService } from '../../../../core/services/cart';
import { WishlistService } from '../../../../core/services/wishlist-service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatChipsModule, MatButtonModule, MatIconModule, MatDividerModule, MatProgressSpinnerModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  wishlistService = inject(WishlistService);

  isFavorite$!: Observable<boolean>;
  data$!: Observable<ProductWithReviews>;

  ngOnInit() {
    this.data$ = this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      distinctUntilChanged(),
      switchMap((id) => this.productService.getDetailWithReviews(id))
    );

    this.isFavorite$ = this.route.paramMap.pipe(
      switchMap((params) => this.wishlistService.isInWishlist(Number(params.get('id'))))
    );
  }

  addToCart(product: any) {
    this.cartService.addItem(product);
  }

  toggleWishlist(product: any) {
    this.wishlistService.toggleWishlist(product);
  }
}
