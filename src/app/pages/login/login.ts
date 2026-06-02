import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  loading = false;
  error = '';

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';

    const email = this.form.value.email!;
    const password = this.form.value.password!;

    this.auth.login(email, password)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          // Ambil returnUrl dari query param, atau ke /home jika tidak ada
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
          this.router.navigateByUrl(returnUrl);
        },
        error: (err) => {
          this.error = err.message;
        }
      });
  }
}