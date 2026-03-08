import { Component, inject, signal, computed } from "@angular/core";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../core/services/auth.service";
import { ThemeService } from "../../core/services/theme.service";
import { SafeHtmlPipe } from "../../shared/pipes/safe-html.pipe";

interface NavItem {
  path: string;
  label: string;
  icon: string;
  adminOnly?: boolean;
}

@Component({
  selector: "app-shell",
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    SafeHtmlPipe,
  ],
  templateUrl: "./shell.component.html",
})
export class ShellComponent {
  auth = inject(AuthService);
  theme = inject(ThemeService);

  user = this.auth.currentUser;
  agency = this.auth.currentAgency;

  sidebarOpen = signal(true);

  private readonly navItems: NavItem[] = [
    {
      path: "dashboard",
      label: "Dashboard",
      icon: this.svgIcon(
        "M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 7V14h7v7h-7z",
      ),
    },
    {
      path: "sales",
      label: "Ventas",
      icon: this.svgIcon(
        "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0",
      ),
    },
    {
      path: "bookings",
      label: "Reservas",
      icon: this.svgIcon(
        "M3 4h18v16a2 2 0 01-2 2H5a2 2 0 01-2-2zM3 10h18M8 2v4M16 2v4",
      ),
    },
    {
      path: "clients",
      label: "Clientes",
      icon: this.svgIcon(
        "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
      ),
    },
    {
      path: "providers",
      label: "Proveedores",
      icon: this.svgIcon(
        "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10",
      ),
    },
    {
      path: "team",
      label: "Equipo",
      icon: this.svgIcon(
        "M12 15c-4.42 0-8 1.79-8 4v1h16v-1c0-2.21-3.58-4-8-4zM12 12a4 4 0 100-8 4 4 0 000 8z",
      ),
      adminOnly: true,
    },
    {
      path: "account",
      label: "Mi cuenta",
      icon: this.svgIcon(
        "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z",
      ),
    },
  ];

  visibleNav = computed(() =>
    this.navItems.filter((item) => !item.adminOnly || this.auth.isAdmin()),
  );

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  logout() {
    this.auth.logout();
  }

  private svgIcon(pathData: string): string {
    return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      ${pathData
        .split("M")
        .filter(Boolean)
        .map((d) => `<path d="M${d}"/>`)
        .join("")}
    </svg>`;
  }
}
