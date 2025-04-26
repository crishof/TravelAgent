import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IBooking } from '../../model/booking.model';
import { BookingService } from '../../services/booking.service';

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

  ngOnInit(): void {
    this._bookingService.getAllBookings().subscribe((data: IBooking[]) => {
      this.bookingList = data;
    });
  }
}
