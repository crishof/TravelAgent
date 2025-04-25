import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  menuOption: string = '';
  currentYear: number = new Date().getFullYear();

  onOption(menuOption: string) {
    this.menuOption = menuOption;
  }
}
