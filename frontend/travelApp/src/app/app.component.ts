import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { AuthService } from './services/auth.service';
import { SessionExpiredModalComponent } from './utils/session-expired-modal/session-expired-modal.component';
import { SessionService } from './services/session.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarComponent,
    FooterComponent,
    SessionExpiredModalComponent,
  ],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  readonly _authService = inject(AuthService);
  readonly _sessionService = inject(SessionService);
  readonly _router = inject(Router);
  readonly _cdr = inject(ChangeDetectorRef);
  currentRoute = this._router.url;

  constructor() {
    this._router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event) => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }

  showModal = false;

  ngOnInit(): void {
    this._sessionService.clearSessionExpired();

    this._sessionService.sessionExpired$.subscribe((expired) => {
      const isLoginPage = this._router.url === '/login';
      const loggedIn = this._authService.isLoggedIn();
      
      // ✅ Solo mostrar modal si estoy logueado y no estoy en /login
      this.showModal = expired && loggedIn && !isLoginPage;

      if (this.showModal) {
        this._cdr.detectChanges();
      }
    });
  }

  onAccept() {
    this.showModal = false;
    this._sessionService.clearSessionExpired();
    this._authService.logout(); // Esto redirige a /login
  }

  get shouldShowModal(): boolean {
    return this.showModal;
  }

  get isLoggedIn(): boolean {
    return this._authService.isLoggedIn();
  }

  isLoginRoute(): boolean {
    return this.currentRoute === '/login';
  }
}
