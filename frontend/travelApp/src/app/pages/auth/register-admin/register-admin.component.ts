import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { RegisterRequest } from '../../../model/registerRequest';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    HttpClientModule,
  ],
  templateUrl: './register-admin.component.html',
  styleUrl: './register-admin.component.css',
})
export class RegisterAdminComponent {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error: string | null = null;
  formBuilder = inject(FormBuilder);
  readonly _authService = inject(AuthService);
  readonly _router = inject(Router);

  constructor() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      agencyName: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.error = null;

    const request: RegisterRequest = this.registerForm.value;

    this._authService.register(request).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this._router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;

        const errorMessage = err?.error?.message;

        if (err.status === 409 && errorMessage) {
          this.error = errorMessage;
        } else {
          this.error = 'Ocurrió un error al registrarse.';
        }
        setTimeout(() => {
          this.error = null;
          this.registerForm.get('email')?.reset();
          this.registerForm.get('password')?.reset();
        }, 5000);
      },
    });
  }
}
