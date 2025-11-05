import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SaleService } from '../../../services/sale.service';
import { CommonModule, Location } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PaymentService } from '../../../services/payment.service';
import { CustomerPaymentService } from '../../../services/customer-payment.service';
import { ICustomerPayment } from '../../../model/customerPayment.model';
import { ISupplier } from '../../../model/supplier.model';
import { BookingService } from '../../../services/booking.service';
import { IBooking } from '../../../model/booking.model';
import { SupplierService } from '../../../services/supplier.service';

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
  readonly _bookingService = inject(BookingService);
  readonly _supplierService = inject(SupplierService);
  readonly cdr = inject(ChangeDetectorRef);
  readonly _customerPaymentService = inject(CustomerPaymentService);
  
  isLoading: boolean = true;
  isAddingPayment: boolean = false;
  isAddingBooking: boolean = false;
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

  newServiceForm!: FormGroup;
  formBuilder = inject(FormBuilder);
  selectedSupplier: ISupplier | null = null;
  supplierList: ISupplier[] = [];
  todayString: string = new Date().toISOString().split('T')[0];
  currentFee: number = 0;

  ngOnInit(): void {
    const saleIdParam = this.route.snapshot.paramMap.get('id');
    const saleId = Number(saleIdParam);

    if (!isNaN(saleId)) {
      this.saleId = saleId;

      // Inicializar el formulario antes de usarlo
      this.newServiceForm = this.formBuilder.group({
        supplierId: ['', Validators.required],
        bookingNumber: [''],
        bookingDate: [this.todayString],
        reservationDate: [''],
        description: [''],
        amount: [0, Validators.required],
        currency: ['USD', Validators.required],
        paid: [false],
      });

      this.loadSaleDetails(saleId);
      this.loadCurrentFee(saleId);
      this.loadSupplierList();
    } else {
      console.error('Invalid sale ID');
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
        alert('Error loading sale details:' + error);
      },
    });
  }

  loadCurrentFee(saleId: number): void {
    this._saleService.getCurrentFee(saleId).subscribe({
      next: (data) => {
        this.currentFee = data;
      },
      error: (error) => {
        alert('Error loading current fee:' + error);
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

  toggleReservationForm() {
    this.isAddingBooking = !this.isAddingBooking;
    if (!this.isAddingBooking) {
      this.initNewServiceForm();
    }
  }

  loadSupplierList() {
    this._supplierService.getAllSuppliers().subscribe((data: ISupplier[]) => {
      this.supplierList = data;
    });
  }

  initNewServiceForm() {
    this.newServiceForm = this.formBuilder.group({
      supplierId: ['', Validators.required],
      bookingNumber: ['', Validators.required],
      bookingDate: [new Date().toISOString().split('T')[0]],
      reservationDate: ['', Validators.required],
      description: ['', Validators.required],
      amount: [0, Validators.required],
      currency: ['USD', Validators.required],
      paid: [false],
    });
  }

  onSupplierChange() {
    const supplierId = this.newServiceForm.get('supplierId')?.value;
    this.selectedSupplier =
      this.supplierList.find((s) => s.id == supplierId) || null;
    if (this.selectedSupplier) {
      this.newServiceForm
        .get('currency')
        ?.setValue(this.selectedSupplier.currency);
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

  addService() {
    if (!this.saleId) return;

    const booking: IBooking = {
      ...this.newServiceForm.value,
      saleId: this.saleId,
      saleCurrency: this.sale.currency,
    };

    this._bookingService.createBooking(booking).subscribe({
      next: (data) => {
        this.isAddingBooking = false;
        this.loadSaleDetails(this.saleId!);
      },
      error: (error) => {
        console.error('Error adding service:', error);
      },
    });

    this.newServiceForm.reset({
      supplierId: '',
      bookingNumber: '',
      bookingDate: new Date().toISOString().split('T')[0],
      reservationDate: '',
      description: '',
      amount: 0,
      currency: 'USD',
      paid: false,      
    });

    this.selectedSupplier = null;
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
