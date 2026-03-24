import { Component, inject, signal, OnInit, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-accept-invite",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./accept-invite.component.html",
})
export class AcceptInviteComponent implements OnInit {
  @Input() token!: string; // from route param via withComponentInputBinding

  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loadingInvite = signal(true);
  inviteInfo = signal<{ email: string; agencyName: string } | null>(null);
  inviteError = signal("");
  loading = signal(false);
  error = signal("");

  form = this.fb.group({
    fullName: ["", Validators.required],
    password: ["", [Validators.required, Validators.minLength(8)]],
  });

  ngOnInit() {
    const token =
      this.token ||
      this.route.snapshot.paramMap.get("token") ||
      this.route.snapshot.queryParamMap.get("token") ||
      "";
    if (!token) {
      this.inviteError.set("Invitación inválida o expirada");
      this.loadingInvite.set(false);
      return;
    }

    this.token = token;

    this.auth.getInviteInfo(token).subscribe({
      next: (info) => {
        this.inviteInfo.set(info);
        this.loadingInvite.set(false);
      },
      error: (e) => {
        if (e?.status === 401) {
          this.inviteError.set(
            "No se pudo validar la invitación: el backend está pidiendo autenticación en invite-info.",
          );
        } else {
          this.inviteError.set(e?.error?.message || "Invitación inválida o expirada");
        }
        this.loadingInvite.set(false);
      },
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.auth
      .acceptInvite({
        token: this.token,
        fullName: this.form.value.fullName!,
        password: this.form.value.password!,
      })
      .subscribe({
        next: () => void this.router.navigate(["/app/dashboard"]),
        error: (e) => {
          this.error.set(e?.error?.message || "Error al aceptar invitación");
          this.loading.set(false);
        },
      });
  }
}
