import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-reset-password",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./reset-password.component.html",
})
export class ResetPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  loading = signal(false);
  error = signal("");
  successMessage = signal("");

  form = this.fb.group({
    token: ["", Validators.required],
    newPassword: [
      "",
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-]).+$/),
      ],
    ],
    confirmPassword: ["", Validators.required],
  });

  constructor() {
    const token = this.route.snapshot.queryParamMap.get("token");
    if (token) {
      this.form.patchValue({ token });
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const newPassword = this.form.value.newPassword ?? "";
    const confirmPassword = this.form.value.confirmPassword ?? "";

    if (newPassword !== confirmPassword) {
      this.error.set("Las contraseñas no coinciden");
      return;
    }

    this.loading.set(true);
    this.error.set("");
    this.successMessage.set("");

    this.auth
      .resetPassword({
        token: this.form.value.token?.trim() ?? "",
        newPassword,
        confirmPassword,
      })
      .subscribe({
        next: (res) => {
          this.successMessage.set(res.message || "Contraseña actualizada correctamente");
          this.loading.set(false);
          setTimeout(() => void this.router.navigate(["/auth/login"]), 1300);
        },
        error: (e) => {
          this.error.set(e?.error?.message || "Token inválido o expirado");
          this.loading.set(false);
        },
      });
  }
}
