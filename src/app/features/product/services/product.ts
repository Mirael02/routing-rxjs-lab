import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of, EMPTY } from 'rxjs';
import { map, catchError, shareReplay, retry } from 'rxjs/operators';

export interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
  description: string;
  stock: number;
}

export interface ProductWithReviews extends Product {
  related: Product[];
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'https://dummyjson.com/products';

  // Cache categories dengan shareReplay agar tidak request berulang kali
  private categories$ = this.http.get<{ products: Product[] }>(this.apiUrl).pipe(
    map(r => [...new Set(r.products.map(p => p.category))]),
    shareReplay(1) 
  );

// Search dengan pagination
  search(query: string, limit = 10): Observable<Product[]> {
    // Bangun parameter menggunakan HttpParams
    let params = new HttpParams().set('limit', limit.toString());
    
    if (query) {
      params = params.set('q', query);
    }
    
    const endpoint = query ? `${this.apiUrl}/search` : this.apiUrl;
    
    return this.http.get<{ products: Product[] }>(endpoint, { params }).pipe(
      map(res => res.products),
      catchError(err => {
        console.error('Product search error:', err);
        return of([]);
      })
    );
  }
  
  // Ambil data detail + review secara paralel
  getDetailWithReviews(id: number): Observable<ProductWithReviews> {
    return forkJoin({
      product: this.http.get<Product>(`${this.apiUrl}/${id}`),
      related: this.http.get<{ products: Product[] }>(this.apiUrl).pipe(
        map(r => r.products.slice(0, 4))
      )
    }).pipe(
      map(({ product, related }) => ({ ...product, related })),
      retry({ count: 2, delay: 1000 }), // Coba ulang maksimal 2 kali dengan jeda 1 detik jika error
      catchError(() => EMPTY)
    );
  }

  getCategories(): Observable<string[]> {
    return this.categories$;
  }
}