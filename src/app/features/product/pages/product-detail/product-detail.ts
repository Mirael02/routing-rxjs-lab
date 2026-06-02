import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { ProductService, ProductWithReviews } from '../../services/product';
import { CartService } from '../../../../core/services/cart';

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

  data$!: Observable<ProductWithReviews>;

  ngOnInit() {
    // Reactive: otomatis load ulang saat param id di URL berubah
    this.data$ = this.route.paramMap.pipe(
      map(params => +params.get('id')!),
      distinctUntilChanged(),
      switchMap(id => this.productService.getDetailWithReviews(id))
    );
  }

  addToCart(product: any) {
    this.cartService.addItem(product);
  }
}