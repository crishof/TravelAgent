import { Component, inject, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ThemeService } from "./core/services/theme.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent implements OnInit {
  private readonly theme = inject(ThemeService);

  ngOnInit() {
    // Theme is now handled entirely by ThemeService
  }
}
