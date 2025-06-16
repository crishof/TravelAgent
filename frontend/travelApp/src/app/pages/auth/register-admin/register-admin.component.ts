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

@Component({
  selector: 'app-register-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-admin.component.html',
  styleUrl: './register-admin.component.css',
})
export class RegisterAdminComponent {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  formBuilder = inject(FormBuilder);
  readonly _authService = inject(AuthService);
  readonly _router = inject(Router);

  constructor() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      agencyName: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.loading = true;

    const request: RegisterRequest = this.registerForm.value;

    this._authService.register(request).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this._router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message ?? 'Registration process failed';
        this.loading = false;
      },
    });
  }
}
