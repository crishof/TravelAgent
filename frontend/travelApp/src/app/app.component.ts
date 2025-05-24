import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ExchangeService } from './services/exchange.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    this.getExchangeRate();
  }

  title = 'travelApp';
  menuOption: string = '';
  currentYear: number = new Date().getFullYear();
  exchangeRate: number = 0;
  _exchangeService = inject(ExchangeService);
  isEURtoUSD: boolean = true;

  onOption(menuOption: string) {
    this.menuOption = menuOption;
  }

  getExchangeRate(): number {
    this._exchangeService.getExchangeRate('EUR', 'USD').subscribe((data) => {
      this.exchangeRate = data;
    });
    return this.exchangeRate;
  }

  toggleExchangeDirection() {
    this.isEURtoUSD = !this.isEURtoUSD;
  }

  get displayRate(): number {
    return this.isEURtoUSD ? this.exchangeRate : 1 / this.exchangeRate;
  }

  get fromCurrency(): string {
    return this.isEURtoUSD ? 'EUR' : 'USD';
  }

  get toCurrency(): string {
    return this.isEURtoUSD ? 'USD' : 'EUR';
  }
}
