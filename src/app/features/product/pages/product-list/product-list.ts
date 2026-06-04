import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { startWith, debounceTime, distinctUntilChanged, tap, switchMap, catchError, map } from 'rxjs/operators';
import { ProductService, Product } from '../../services/product';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-list.html'
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);

  searchControl = new FormControl('');
  categoryControl = new FormControl('');
  
  isLoading = false;
  categories$!: Observable<string[]>;
  products$!: Observable<Product[]>;

  ngOnInit() {
    this.categories$ = this.productService.getCategories();

    this.products$ = combineLatest([
    this.searchControl.valueChanges.pipe(
      startWith(''), // Bagian ini wajib ada
      debounceTime(350),
      distinctUntilChanged()
    ),
    this.categoryControl.valueChanges.pipe(
      startWith('') // Bagian ini juga wajib ada
    )
      ]).pipe(
    tap(() => this.isLoading = true),
    switchMap(([searchTerm, category]) =>
      this.productService.search(searchTerm || '').pipe(
        map(products => category ? products.filter(p => p.category === category) : products)
    )
  ),
  tap(() => this.isLoading = false),
  catchError(() => of([]))
);  }
}