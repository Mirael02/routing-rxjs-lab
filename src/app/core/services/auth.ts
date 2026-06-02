import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  id: string;
  name: string;
  email: string;
  roles: ('USER' | 'ADMIN')[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser$ = new BehaviorSubject<User | null>(null);
  private router = inject(Router);

  readonly isLoggedIn$: Observable<boolean> = this.currentUser$.pipe(map(user => user !== null));
  readonly currentUser: Observable<User | null> = this.currentUser$.asObservable();

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('user');
      if (saved) {
        this.currentUser$.next(JSON.parse(saved));
      }
    }
  }

  login(email: string, password: string): Observable<User> {
    // Simulasi login, ganti dengan HTTP call nyata nanti
    const mockUsers: Record<string, User> = {
      'user@test.com': { id: '1', name: 'Budi', email, roles: ['USER'] },
      'admin@test.com': { id: '2', name: 'Admin', email, roles: ['USER', 'ADMIN'] }
    };

    const user = mockUsers[email];
    if (!user || password !== 'password123') {
      return throwError(() => new Error('Email atau password salah'));
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
    this.currentUser$.next(user);
    return of(user);
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    this.currentUser$.next(null);
    this.router.navigate(['/login']);
  }

  hasRole(role: string): boolean {
    return this.currentUser$.value?.roles.includes(role as any) ?? false;
  }
}