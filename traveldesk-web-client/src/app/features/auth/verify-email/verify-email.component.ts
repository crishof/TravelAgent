import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-verify-email",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./verify-email.component.html",
})
export class VerifyEmailComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  loading = signal(false);
  error = signal("");

  form = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    code: ["", [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  constructor() {
    const prefillEmail = this.route.snapshot.queryParamMap.get("email");
    if (prefillEmail) {
      this.form.patchValue({ email: prefillEmail });
    }
  }

  submit() {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set("");

    const email = this.form.value.email?.trim() ?? "";
    const code = this.form.value.code?.trim() ?? "";

    this.auth.verifyEmail({ email, code }).subscribe({
      next: () => {
        if (this.auth.isLoggedIn()) {
          void this.router.navigate(["/app/dashboard"]);
          return;
        }

        void this.router.navigate(["/auth/login"], {
          queryParams: { email },
        });
      },
      error: (e) => {
        this.error.set(e?.error?.message || "Código inválido o expirado");
        this.loading.set(false);
      },
    });
  }
}
