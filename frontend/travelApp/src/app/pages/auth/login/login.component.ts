import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  formBuilder = inject(FormBuilder);
  submitted = false;

  error: string | null = null;

  readonly _formbBuilder = inject(FormBuilder);
  readonly _authService = inject(AuthService);
  readonly _router = inject(Router);

  sessionExpired = false;

  constructor() {
    this.loginForm = this._formbBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this._authService.isBrowser()) {
      const expired = localStorage.getItem('sessionExpired');
      if (expired === 'true') {
        this.sessionExpired = true;
        localStorage.removeItem('sessionExpired');
      }
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    this.error = null;

    this._authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this._authService.setTokens(res.token, res.refreshToken);
        this._router.navigate(['/dashboard']);
      },
      error: (err) => {
        const errorMessage =
          err.error?.message || 'Login failed. Please try again.';

        if (err.status === 401 && errorMessage) {
          this.error = errorMessage;
        } else {
          this.error = 'An unexpected error occurred. Please try again later.';
        }
        setTimeout(() => {
          this.error = null;
        }, 3000);
        this.submitted = false;
      },
    });
  }
}
