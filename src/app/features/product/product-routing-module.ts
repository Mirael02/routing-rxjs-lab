import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', 
    loadComponent: () => import('./pages/product-list/product-list').then(c => c.ProductList)
  },
  {
    // Tambahkan rute untuk halaman detail ini
    path: ':id', 
    loadComponent: () => import('./pages/product-detail/product-detail').then(c => c.ProductDetail)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}