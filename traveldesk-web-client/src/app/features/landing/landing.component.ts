import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-landing",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./landing.component.html",
})
export class LandingComponent {
  readonly highlights = [
    {
      title: "Ventas y reservas conectadas",
      description:
        "Gestiona ventas, bookings y proveedores en un mismo flujo para evitar información duplicada.",
    },
    {
      title: "Cuenta de comisiones clara",
      description:
        "Visualiza cobros y saldo por moneda para tomar decisiones rápidas con información confiable.",
    },
    {
      title: "Equipo y permisos por rol",
      description:
        "Administra agentes, visibilidad de datos y configuración de la agencia de forma segura.",
    },
  ];

  readonly steps = [
    {
      name: "Crea tu agencia",
      detail:
        "Registra la agencia y configura moneda, comisión y preferencias iniciales.",
    },
    {
      name: "Carga clientes y proveedores",
      detail:
        "Incorpora tu base operativa para empezar a trabajar sin fricción.",
    },
    {
      name: "Registra ventas y seguimiento",
      detail:
        "Controla estados, pagos y rentabilidad en tiempo real desde el panel principal.",
    },
  ];
}
