import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { combineLatest, Observable, of } from 'rxjs';
import { startWith, debounceTime, distinctUntilChanged, tap, switchMap, catchError, map } from 'rxjs/operators';
import { ProductService, Product } from '../../services/product';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatProgressSpinnerModule, MatCardModule, MatButtonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
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
      this.searchControl.valueChanges.pipe(startWith(''), debounceTime(350), distinctUntilChanged()),
      this.categoryControl.valueChanges.pipe(startWith('')),
    ]).pipe(
      tap(() => (this.isLoading = true)),
      switchMap(([searchTerm, category]) =>
        this.productService.search(searchTerm || '').pipe(
          map((products) => (category ? products.filter((p) => p.category === category) : products))
        )
      ),
      tap(() => (this.isLoading = false)),
      catchError(() => of([]))
    );
  }
}
