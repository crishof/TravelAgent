import { Component, inject, OnInit } from '@angular/core';
import { LoadingComponent } from '../../utils/loading/loading.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  isLoading: boolean = true;
  readonly _router = inject(Router);

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 500); // Simulate a 500ms delay
  }

  goToNewSale() {
    this._router.navigate(['/sale/createSale']);
  }

  goToPendingBookings() {
    this._router.navigate(['/booking'], { queryParams: { pending: true } });
  }

  goToSalesWithBalance() {
    this._router.navigate(['/sale'], { queryParams: { pendingBalance: true } });
  }
}
