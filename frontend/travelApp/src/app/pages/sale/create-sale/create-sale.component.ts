import { Component } from '@angular/core';
import { ISale } from '../../../model/sale.model';
import { IBooking } from '../../../model/booking.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-create-sale',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './create-sale.component.html',
  styleUrl: './create-sale.component.css',
})
export class CreateSaleComponent {
  sale: ISale = {
    id: 0,
    agentId: 0,
    creationDate: this.creationDate(),
    travelDate: '',
    amount: 0,
    currency: 'USD',
    description: '',
    services: [],
  };

  newService: IBooking = {
    id: '',
    supplierId: '',
    bookingNumber: '',
    bookingDate: '',
    reservationDate: '',
    description: '',
    amount: 0,
    currency: 'USD',
    paid: false,
  };

  creationDate() {
    return new Date().toISOString().split('T')[0]; // Retorna la fecha en formato YYYY-MM-DD
  }

  addService() {
    // Agrega el servicio a la lista de servicios
    this.sale.services.push({ ...this.newService });

    // Limpia el formulario de servicio para agregar otro servicio
    this.newService = {
      id: '',
      supplierId: '',
      bookingNumber: '',
      bookingDate: '',
      reservationDate: '',
      description: '',
      amount: 0,
      currency: 'USD',
      paid: false,
    };
  }

  removeService(index: number) {
    // Elimina un servicio de la lista
    this.sale.services.splice(index, 1);
  }

  saveSale() {
    // Aquí manejarías la lógica para guardar la venta
    console.log('Sale saved:', this.sale);
  }
}
