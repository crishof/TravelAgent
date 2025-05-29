import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IBooking } from '../../model/booking.model';
import { BookingService } from '../../services/booking.service';
import { SupplierService } from '../../services/supplier.service';
import { ISupplier } from '../../model/supplier.model';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],

  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
})
export class BookingComponent implements OnInit {
  bookingList: IBooking[] = [];
  readonly _bookingService = inject(BookingService);
  readonly _supplierService = inject(SupplierService);
  readonly _route = inject(ActivatedRoute);

  ngOnInit(): void {
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
      this.populateSupplierNames();
    });
  }

  private populateSupplierNames(): void {
    this.bookingList.forEach((booking) => {
      this._supplierService.getSupplierById(booking.supplierId).subscribe({
        next: (supplier: ISupplier) => {
          booking.supplierName = supplier.supplierName || 'Unknown Supplier';
        },
        error: () => {
          booking.supplierName = 'Unknown Supplier';
        },
      });
    });
  }
}
