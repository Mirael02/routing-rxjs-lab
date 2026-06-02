import { CanDeactivateFn } from '@angular/router';

// Interface yang nanti akan di-implementasikan oleh komponen form
export interface HasUnsavedChanges {
  hasUnsavedChanges: () => boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component) => {
  // Jika komponen punya method hasUnsavedChanges dan mengembalikan true
  if (component.hasUnsavedChanges && component.hasUnsavedChanges()) {
    return confirm('Ada perubahan yang belum disimpan. Lanjutkan keluar?');
  }
  return true; // Jika tidak ada perubahan, boleh langsung keluar
};