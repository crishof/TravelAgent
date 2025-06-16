import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SaleService } from '../../../services/sale.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentService } from '../../../services/payment.service';
import { CustomerPaymentService } from '../../../services/customer-payment.service';
import { ICustomerPayment } from '../../../model/customerPayment.model';

@Component({
  selector: 'app-sale-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sale-details.component.html',
  styleUrl: './sale-details.component.css',
})
export class SaleDetailsComponent implements OnInit {
  constructor(readonly route: ActivatedRoute) {}

  saleId: number | null = null;

  sale: any;
  payments: ICustomerPayment[] = [];
  pendingBalance: number = 0;
  readonly _saleService = inject(SaleService);
  readonly _paymentService = inject(PaymentService);
  readonly _location = inject(Location);
  readonly _customerPaymentService = inject(CustomerPaymentService);
  isLoading: boolean = true;
  isAddingPayment: boolean = false;
  newPayment: ICustomerPayment = {
    id: 0,
    customerId: 0,
    travelId: 0,
    amount: null,
    currency: '',
    paymentMethod: '',
    paymentDate: '',
    exchangeRate: 0,
    amountInSaleCurrency: 0,
    saleCurrency: '',
  };

  currentFee: number = 0;

  ngOnInit() {
    const saleId = this.route.snapshot.paramMap.get('id');
    if (saleId && !isNaN(Number(saleId))) {
      this.saleId = Number(saleId);
      this.loadSaleDetails(Number(saleId));
      this.loadCurrentFee(Number(saleId));
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

  loadCurrentFee(saleId: number): void {
    this._saleService.getCurrentFee(saleId).subscribe({
      next: (data) => {
        this.currentFee = data;
      },
      error: (error) => {
        console.error('Error loading current fee:', error);
      },
    });
  }

  calculatePendingBalance(): void {
    if (this.sale && this.payments.length > 0) {
      const totalPayments = this.payments.reduce(
        (sum, payment) => sum + payment.amountInSaleCurrency,
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

  togglePaymentForm() {
    this.isAddingPayment = !this.isAddingPayment;
    if (!this.isAddingPayment) {
      this.resetPaymentForm();
    }
  }

  addPayment() {
    if (!this.saleId || !this.sale.customerResponse) {
      console.error('Sale ID or customer ID is missing.');
      return;
    }
    const payment = {
      ...this.newPayment,
      paymentDate: new Date().toISOString(),
      customerId: this.sale.customerResponse.id,
      travelId: this.saleId,
      saleCurrency: this.sale.currency,
    };
    this._customerPaymentService.addPayment(payment).subscribe({
      next: (data) => {
        console.log('Payment added successfully:', data);
        this.isAddingPayment = false;
        this.resetPaymentForm();
        this.loadPayments(this.saleId!, this.sale.customerResponse.id);
        this.loadCurrentFee(this.saleId!);
      },
      error: (error) => {
        console.error('Error adding payment:', error);
      },
    });
  }

  resetPaymentForm() {
    this.newPayment = {
      id: 0,
      customerId: 0,
      travelId: 0,
      amount: null,
      currency: '',
      paymentMethod: '',
      paymentDate: '',
      exchangeRate: 0,
      amountInSaleCurrency: 0,
      saleCurrency: '',
    };
  }
}
