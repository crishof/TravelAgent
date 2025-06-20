import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ISupplier } from '../../model/supplier.model';
import { SupplierService } from '../../services/supplier.service';
import { LoadingComponent } from '../../utils/loading/loading.component';

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.css',
})
export class SupplierComponent implements OnInit {
  supplierList: ISupplier[] = [];
  readonly _supplierService = inject(SupplierService);
  supplierForm!: FormGroup;
  formBuilder = inject(FormBuilder);
  isLoading: boolean = true;

  ngOnInit(): void {
    this.isLoading = true;

    this.supplierForm = this.formBuilder.group({
      name: ['', Validators.required],
      currency: ['', Validators.required],
    });

    this.loadSuppliers();
    setTimeout(() => {
      this.isLoading = false;
    }, 500); // Simulate a 500ms delay
  }

  loadSuppliers(): void {
    this._supplierService.getAllSuppliers().subscribe((data: ISupplier[]) => {
      this.supplierList = data;
    });
  }

  createSupplier(): void {
    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      return;
    }

    const newSupplier: ISupplier = {
      id: 0, // El backend debe asignar el id
      supplierName: this.supplierForm.value.name,
      currency: this.supplierForm.value.currency,
    };

    this._supplierService.createSupplier(newSupplier).subscribe({
      next: (createdSupplier: ISupplier) => {
        // Agrega el nuevo supplier a la lista para mostrarlo inmediatamente
        this.supplierList.push(createdSupplier);
        this.supplierForm.reset();
      },
      error: (error: unknown) => {
        console.error('Error creating supplier:', error);
        alert('Error creating supplier');
      },
    });
  }
}
