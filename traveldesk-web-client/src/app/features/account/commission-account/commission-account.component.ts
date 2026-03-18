import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-commission-account",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./commission-account.component.html",
})
export class CommissionAccountComponent {
  auth = inject(AuthService);
  user = this.auth.currentUser;
}
