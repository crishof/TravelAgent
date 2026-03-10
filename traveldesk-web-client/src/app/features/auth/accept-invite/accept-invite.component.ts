import { Component, inject, signal, OnInit, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
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
    this.auth.getInviteInfo(this.token).subscribe({
      next: (info) => {
        this.inviteInfo.set(info);
        this.loadingInvite.set(false);
      },
      error: () => {
        this.inviteError.set("Invitación inválida o expirada");
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
        email: this.inviteInfo()!.email,
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
