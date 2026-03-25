import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-forgot-password",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./forgot-password.component.html",
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  loading = signal(false);
  error = signal("");
  successMessage = signal("");

  form = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
  });

  submit() {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set("");
    this.successMessage.set("");

    const email = this.form.value.email?.trim() ?? "";

    this.auth.forgotPassword({ email }).subscribe({
      next: (res) => {
        this.successMessage.set(
          res.message || "Si el correo existe, enviamos un enlace para restablecer la contraseña.",
        );
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e?.error?.message || "No se pudo procesar la solicitud");
        this.loading.set(false);
      },
    });
  }
}
