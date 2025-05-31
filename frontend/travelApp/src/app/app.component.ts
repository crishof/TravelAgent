import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ExchangeService } from './services/exchange.service';
import { GlobalService } from './services/global.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, FormsModule],
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
  _globalService = inject(GlobalService);
  isEURtoUSD: boolean = true;
  searchTerm: string = '';
  _router = inject(Router);
  noResults: boolean = false;

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

  globalSearch(event: Event) {
    event.preventDefault();
    this._globalService
      .findByTerm(this.searchTerm)
      .subscribe((searchResult) => {
        if (
          !searchResult.results ||
          searchResult.results.length === 0 ||
          searchResult.type === 'none'
        ) {
          this.noResults = true;
          this.searchTerm = '';
          return;
        }

        this.noResults = false;

        if (searchResult.type === 'Booking') {
          if (searchResult.results.length === 1) {
            const bookingId = searchResult.results[0].id;
            this.searchTerm = '';
            this._router.navigate(['/booking/booking-details', bookingId]);
          } else if (searchResult.results.length > 1) {
            const ids = searchResult.results.map((b: any) => b.id).join(',');
            this.searchTerm = '';
            this._router.navigate(['/booking'], {
              queryParams: { ids },
            });
          }
        }

        if (searchResult.type === 'Customer') {
          if (searchResult.results.length === 1) {
            this.searchTerm = '';
            const customerId = searchResult.results[0].id;
            this._router.navigate(['/customer/customer-details/', customerId]);
          } else if (searchResult.results.length > 1) {
            const ids = searchResult.results.map((c: any) => c.id).join(',');
            this.searchTerm = '';
            this._router.navigate(['/customer'], {
              queryParams: { ids },
            });
          }
        }
        this.searchTerm = '';
      });
  }
}
