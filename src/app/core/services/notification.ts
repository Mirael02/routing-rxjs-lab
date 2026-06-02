import { Injectable } from '@angular/core';
import { ReplaySubject, concat, of } from 'rxjs';
import { delay, shareReplay, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  // Buffer 5 notifikasi terakhir
  private toasts$ = new ReplaySubject<string>(5); 

  readonly activeToast$ = this.toasts$.pipe(
    switchMap(msg => concat(
      of(msg), // Tampilkan pesan
      of(null).pipe(delay(3000)) // Hapus nilainya (menjadi null) setelah 3 detik
    )),
    shareReplay(1)
  );

  show(message: string) {
    this.toasts$.next(message);
  }
}