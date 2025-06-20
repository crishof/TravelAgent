import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IBooking } from '../../model/booking.model';
import { BookingService } from '../../services/booking.service';
import { SupplierService } from '../../services/supplier.service';
import { ISupplier } from '../../model/supplier.model';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { PaymentModalComponent } from '../../utils/payment-modal/payment-modal.component';
import { PaymentService } from '../../services/payment.service';
import { IPayment } from '../../model/payment.model';
import { LoadingComponent } from '../../utils/loading/loading.component';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaymentModalComponent,
    LoadingComponent,
  ],

  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
})
export class BookingComponent implements OnInit {
  bookingList: IBooking[] = [];
  readonly _bookingService = inject(BookingService);
  readonly _supplierService = inject(SupplierService);
  readonly _route = inject(ActivatedRoute);
  readonly _paymentService = inject(PaymentService);
  hoveredBookingId: number | null = null;
  showPaymentModal: boolean = false;
  selectedBookingId?: number;
  selectedSupplierName?: string;
  selectedSupplierCurrency?: string;
  selectedBookingNumber?: string;
  isLoading: boolean = true;
  readonly _router = inject(Router);

  ngOnInit(): void {
    this.isLoading = true;
    combineLatest([
      this._bookingService.getAllBookings(),

      this._route.queryParams,
    ]).subscribe(([data, params]) => {
      let filteredList = data;
      if (params['ids']) {
        const ids = params['ids'].split(',').map((id: string) => +id);
        filteredList = data.filter((booking) => ids.includes(booking.id));
      }
      this.bookingList = filteredList;
      setTimeout(() => {
        this.isLoading = false;
      }, 500); // Simulate a 500ms delay
    });
  }

  openPaymentModal(booking: IBooking) {
    this.selectedBookingId = booking.id;
    this.selectedSupplierName = booking.supplierName;
    this.selectedBookingNumber = booking.bookingNumber;
    this.selectedSupplierCurrency = booking.currency;
    this.showPaymentModal = true;
  }
  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.selectedBookingId = undefined;
  }
  onPaymentRegistered(paymentData: any): void {
    const payment: IPayment = {
      bookingId: paymentData.bookingId,
      amount: paymentData.amount,
      paymentDate: new Date().toISOString(),
      currency: this.selectedSupplierCurrency ?? '',
      description: paymentData.description,
    };
    this._paymentService.savePayment(payment).subscribe({
      next: (response) => {
        console.log('Payment saved successfully:', response);
        const booking = this.bookingList.find(
          (b) => b.id === payment.bookingId
        );
        if (booking) {
          booking.paid = true;
        }
      },
      error: (error) => {
        console.error('Error saving payment:', error);
      },
    });
    console.log('Payment registered:', paymentData);
    this.closePaymentModal();
  }

  goToSale(saleId: number): void {
    this._router.navigate([`/sale/sale-details`, saleId]);
  }
}
