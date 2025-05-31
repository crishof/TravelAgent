import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrl: './payment-modal.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class PaymentModalComponent {
  @Input() bookingId?: number;
  @Input() supplierName?: string;
  @Input() bookingNumber?: string;
  @Input() show = false;
  @Output() close = new EventEmitter<void>();
  @Output() paymentRegistered = new EventEmitter<any>();

  paymentAmount: number | null = null;
  description: string = '';

  onSubmit() {
    this.paymentRegistered.emit({
      bookingId: this.bookingId,
      amount: this.paymentAmount,
      description: this.description,
    });
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }
}
