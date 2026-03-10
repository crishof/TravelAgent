import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-account",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./account.component.html",
})
export class AccountComponent {
  auth = inject(AuthService);
  user = this.auth.currentUser;
}
