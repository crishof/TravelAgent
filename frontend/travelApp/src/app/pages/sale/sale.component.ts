import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ISale } from '../../model/sale.model';
import { SaleService } from '../../services/sale.service';
import { Router, RouterLink } from '@angular/router';
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
  readonly _router = inject(Router);

  ngOnInit(): void {
    this._saleService.getAllSales().subscribe((data: ISale[]) => {
      this.saleList = data;
    });
  }

  goToDetails(saleId: number): void {
    this._router.navigate([`/sale/sale-details`, saleId]);
  }
}
