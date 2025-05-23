import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SaleService } from '../../../services/sale.service';
import { CommonModule, Location } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentService } from '../../../services/payment.service';
import { CustomerPaymentService } from '../../../services/customer-payment.service';
import { ICustomerPayment } from '../../../model/customerPayment.model';

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
  payments: ICustomerPayment[] = [];
  pendingBalance: number = 0;
  readonly _saleService = inject(SaleService);
  readonly _paymentService = inject(PaymentService);
  readonly _location = inject(Location);
  readonly _customerPaymentService = inject(CustomerPaymentService);
  isLoading: boolean = true;

  ngOnInit() {
    const saleId = this.route.snapshot.paramMap.get('id');
    if (saleId) {
      this.saleId = saleId;
      this.loadSaleDetails(Number(saleId));
    }
  }

  loadPayments(saleId: number, customerId: number): void {
    this._customerPaymentService
      .getPaymentsByCustomerAndSaleId(customerId, saleId)
      .subscribe({
        next: (data: ICustomerPayment[]) => {
          this.payments = data; // Asigna la lista de pagos a la propiedad `payments`
          this.calculatePendingBalance(); // Calcula el saldo pendiente después de cargar los pagos
        },
        error: (error) => {
          console.error('Error loading payments:', error);
        },
      });
  }

  loadSaleDetails(saleId: number): void {
    console.log('Loading sale details for ID:', saleId);
    this._saleService.getSaleById(saleId).subscribe({
      next: (data) => {
        this.sale = data;

        if (this.sale.customerResponse) {
          // Una vez que se cargan los detalles de la venta, carga los pagos
          this.loadPayments(saleId, this.sale.customerResponse.id);
        }

        this.calculatePendingBalance();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading sale details:', error);
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
