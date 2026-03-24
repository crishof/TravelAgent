import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./register.component.html",
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  step = signal(1);
  loading = signal(false);
  error = signal("");

  agencyNameCtrl = this.fb.control("", Validators.required);

  adminForm = this.fb.group({
    fullName: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(8)]],
    confirmPassword: ["", Validators.required],
  });

  adminFields = [
    {
      name: "fullName",
      label: "Nombre completo",
      type: "text",
      placeholder: "Ana Rodríguez",
      errorMsg: "Requerido",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "ana@agencia.com",
      errorMsg: "Email válido requerido",
    },
    {
      name: "password",
      label: "Contraseña",
      type: "password",
      placeholder: "Mínimo 8 caracteres",
      errorMsg: "Mínimo 8 caracteres",
    },
    {
      name: "confirmPassword",
      label: "Confirmar contraseña",
      type: "password",
      placeholder: "Repetir contraseña",
      errorMsg: "Requerido",
    },
  ];

  nextStep() {
    if (this.agencyNameCtrl.value) this.step.set(2);
  }

  submit() {
    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      return;
    }
    this.error.set("");

    const { password, confirmPassword, fullName, email } = this.adminForm.value;
    if (password !== confirmPassword) {
      this.error.set("Las contraseñas no coinciden");
      return;
    }
    this.loading.set(true);
    this.auth
      .register({
        agencyName: this.agencyNameCtrl.value!,
        fullName: fullName!,
        email: email!,
        password: password!,
      })
      .subscribe({
        next: () =>
          void this.router.navigate(["/auth/verify-email"], {
            queryParams: { email: email! },
          }),
        error: (e) => {
          this.error.set(e?.error?.message || "Error al registrarse");
          this.loading.set(false);
        },
      });
  }
}
