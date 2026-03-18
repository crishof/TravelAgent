import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../core/services/auth.service";
import { AccountStatementComponent } from "./account-statement/account-statement.component";

@Component({
  selector: "app-account",
  standalone: true,
  imports: [CommonModule, AccountStatementComponent],
  templateUrl: "./account.component.html",
})
export class AccountComponent {
  auth = inject(AuthService);
  user = this.auth.currentUser;
}
