import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ISale } from '../../model/sale.model';
import { SaleService } from '../../services/sale.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterLink,
  ],

  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css',
})
export class SaleComponent implements OnInit {
  saleList: ISale[] = [];
  readonly _saleService = inject(SaleService);

  ngOnInit(): void {
    this._saleService.getAllSales().subscribe((data: ISale[]) => {
      this.saleList = data;
    });
  }
}
