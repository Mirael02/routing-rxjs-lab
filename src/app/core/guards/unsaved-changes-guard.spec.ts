import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { unsavedChangesGuard, HasUnsavedChanges } from './unsaved-changes-guard';

describe('unsavedChangesGuard', () => {
  // Tambahkan <HasUnsavedChanges> di sini agar tipe datanya sesuai
  const executeGuard: CanDeactivateFn<HasUnsavedChanges> = (...guardParameters) => 
      TestBed.runInInjectionContext(() => unsavedChangesGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});