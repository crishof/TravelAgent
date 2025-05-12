import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SaleService } from '../../../services/sale.service';
import { CommonModule, Location } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-sale-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './sale-details.component.html',
  styleUrl: './sale-details.component.css',
})
export class SaleDetailsComponent implements OnInit {
  constructor(readonly route: ActivatedRoute) {}

  saleId: string | null = null;

  sale: any;
  payments: any[] = [];
  pendingBalance: number = 0;
  readonly _saleService = inject(SaleService);
  readonly _paymentService = inject(PaymentService);
  readonly _location = inject(Location);

  ngOnInit() {
    const saleId = this.route.snapshot.paramMap.get('id');
    if (saleId) {
      this.saleId = saleId;
      this.loadSaleDetails(Number(saleId));
    }
  }

  loadSaleDetails(saleId: number): void {
    this._saleService.getSaleById(saleId).subscribe({
      next: (data) => {
        this.sale = data;

        this.calculatePendingBalance();
      },
      error: (error) => {
        console.error('Error loading sale details:', error);
      },
    });

    this._paymentService.getPaymentsBySaleId(saleId).subscribe({
      next: (data) => {
        this.payments = data;
        this.calculatePendingBalance();
      },
      error: (error) => {
        console.error('Error loading payments:', error);
      },
    });
  }

  calculatePendingBalance(): void {
    if (this.sale && this.payments.length > 0) {
      const totalPayments = this.payments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );
      this.pendingBalance = this.sale.amount - totalPayments;
    } else if (this.sale) {
      this.pendingBalance = this.sale.amount;
    }
  }

  goBack(): void {
    this._location.back();
  }
}
