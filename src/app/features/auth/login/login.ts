import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

type AuthMode = 'login' | 'signup';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  mode: AuthMode = 'login';
  errorMessage = '';
  isSubmitting = false;

  form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    this.mode = this.router.url.includes('/signup') ? 'signup' : 'login';
  }

  get isSignup(): boolean {
    return this.mode === 'signup';
  }

  get title(): string {
    return this.isSignup ? 'Sign up' : 'Login';
  }

  get submitLabel(): string {
    if (this.isSubmitting) {
      return this.isSignup ? 'Creating account...' : 'Logging in...';
    }

    return this.isSignup ? 'Create account' : 'Login';
  }

  get passwordStrength(): { label: string; className: string; score: number } {
    const password = this.form.controls.password.value;
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (!password) {
      return { label: 'Enter a password', className: 'empty', score: 0 };
    }

    if (score <= 2) {
      return { label: 'Weak password', className: 'weak', score };
    }

    if (score <= 4) {
      return { label: 'Medium password', className: 'medium', score };
    }

    return { label: 'Strong password', className: 'strong', score };
  }

  submit(): void {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    const { name, email, password } = this.form.getRawValue();

    if (this.isSignup) {
      if (!name.trim()) {
        this.isSubmitting = false;
        this.errorMessage = 'Name is required to create an account.';
        return;
      }

      this.auth.signup(name, email, password).subscribe({
        next: (user) => {
          this.isSubmitting = false;

          if (!user) {
            this.errorMessage = 'An account already exists for this email.';
            return;
          }

          void this.router.navigate(['/jobs/list']);
        },
        error: () => {
          this.isSubmitting = false;
          this.errorMessage = 'Could not create the AWS user.';
        },
      });

      return;
    }

    this.auth.login(email, password).subscribe({
      next: (user) => {
        this.isSubmitting = false;

        if (!user) {
          this.errorMessage = 'Invalid email or password.';
          return;
        }

        void this.router.navigate(['/jobs/list']);
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Could not connect to AWS login.';
      },
    });
  }

  switchMode(mode: AuthMode): void {
    this.mode = mode;
    this.errorMessage = '';
    void this.router.navigate([mode === 'signup' ? '/signup' : '/login']);
  }
}
