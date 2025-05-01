import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ISupplier } from '../../../model/supplier.model';
import { SupplierService } from '../../../services/supplier.service';
import { SaleService } from '../../../services/sale.service';

@Component({
  selector: 'app-create-sale',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-sale.component.html',
  styleUrl: './create-sale.component.css',
})
export class CreateSaleComponent implements OnInit {
  saleForm!: FormGroup;
  newServiceForm!: FormGroup;
  formBuilder = inject(FormBuilder);
  supplierList: ISupplier[] = [];
  readonly _supplierService = inject(SupplierService);
  readonly _saleService = inject(SaleService);
  readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadSupplierList();
    this.initForm();
    this.initNewServiceForm();
  }

  initForm() {
    this.saleForm = this.formBuilder.group({
      agentId: this.getLoggedAgent(),
      customer: this.formBuilder.group({
        name: '',
        lastname: '',
        phone: '',
        email: '',
        dni: '',
        passport: '',
      }),
      creationDate: this.formatDate(new Date().toISOString()),
      travelDate: '',
      amount: 0,
      currency: '',
      description: '',
      services: this.formBuilder.array([]),
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

  get servicesFormArray() {
    return this.saleForm.get('services') as FormArray;
  }

  addService() {
    // Crea un nuevo grupo basado en los valores actuales del formulario
    const serviceGroup = this.formBuilder.group({
      supplierId: [
        this.newServiceForm.get('supplierId')?.value,
        Validators.required,
      ],
      bookingNumber: [
        this.newServiceForm.get('bookingNumber')?.value,
        Validators.required,
      ],
      bookingDate: [this.newServiceForm.get('bookingDate')?.value],
      description: [
        this.newServiceForm.get('description')?.value,
        Validators.required,
      ],
      reservationDate: [this.newServiceForm.get('reservationDate')?.value],
      amount: [this.newServiceForm.get('amount')?.value, Validators.required],
      currency: [
        this.newServiceForm.get('currency')?.value,
        Validators.required,
      ],
      paid: [this.newServiceForm.get('paid')?.value],
    });

    // Agrega el nuevo grupo al FormArray
    this.servicesFormArray.push(serviceGroup);

    // Marca el componente para la detección de cambios en el próximo ciclo
    this.cdr.markForCheck();

    // Reinicia el formulario de servicio
    this.newServiceForm.reset({
      supplierId: '',
      bookingNumber: '',
      bookingDate: this.formatDate(new Date().toISOString()),
      reservationDate: '',
      description: '',
      amount: 0,
      currency: 'USD',
      paid: false,
    });
  }

  formatDate(date: string) {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${d.getFullYear()}`;
  }

  removeService(index: number) {
    this.servicesFormArray.removeAt(index);
  }

  loadSupplierList() {
    this._supplierService.getAllSuppliers().subscribe((data: ISupplier[]) => {
      this.supplierList = data;
    });
  }

  getLoggedAgent() {
    return 1;
  }

  saveSale() {
    console.log('Sale saved:', this.saleForm.value);
  }
}
