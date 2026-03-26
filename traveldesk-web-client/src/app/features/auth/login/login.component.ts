import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { ThemeService } from "../../../core/services/theme.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./login.component.html",
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  theme = inject(ThemeService);

  loading = signal(false);
  error = signal("");
  showResend = signal(false);
  resendLoading = signal(false);
  resendSuccess = signal("");

  form = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required],
  });

  submit() {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set("");
    this.showResend.set(false);
    this.resendSuccess.set("");

    const { email, password } = this.form.value;
    this.auth.login({ email: email!, password: password! }).subscribe({
      next: () => void this.router.navigate(["/app/dashboard"]),
      error: (e) => {
        const msg: string = e?.error?.message || "Credenciales incorrectas";
        this.error.set(msg);
        this.showResend.set(msg.toLowerCase().includes("verification"));
        this.loading.set(false);
      },
    });
  }

  resendCode() {
    const email = this.form.value.email;
    if (!email || this.resendLoading()) return;

    this.resendLoading.set(true);
    this.resendSuccess.set("");

    this.auth.resendVerification(email).subscribe({
      next: () => {
        this.resendSuccess.set("Código reenviado. Revisá tu correo.");
        this.resendLoading.set(false);
        void this.router.navigate(["/auth/verify-email"], { queryParams: { email } });
      },
      error: (e) => {
        this.error.set(e?.error?.message || "Error al reenviar el código");
        this.resendLoading.set(false);
      },
    });
  }
}
