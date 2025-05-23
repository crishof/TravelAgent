import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'travelApp';
  menuOption: string = '';
  currentYear: number = new Date().getFullYear();

  onOption(menuOption: string) {
    this.menuOption = menuOption;
  }
}
