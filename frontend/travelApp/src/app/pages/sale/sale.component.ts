import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ISale } from '../../model/sale.model';
import { SaleService } from '../../services/sale.service';
import { Router, RouterLink } from '@angular/router';
import { LoadingComponent } from '../../utils/loading/loading.component';
@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    LoadingComponent,
  ],

  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css',
})
export class SaleComponent implements OnInit {
  saleList: ISale[] = [];
  readonly _saleService = inject(SaleService);
  readonly _router = inject(Router);
  isLoading: boolean = true;

  ngOnInit(): void {
    this.isLoading = true;
    this._saleService.getAllSales().subscribe((data: ISale[]) => {
      this.saleList = data;
      setTimeout(() => {
        this.isLoading = false;
      }, 500); // Simulate a 500ms delay
    });
  }

  goToDetails(saleId: number): void {
    this._router.navigate([`/sale/sale-details`, saleId]);
  }
}
