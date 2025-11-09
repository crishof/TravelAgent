import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SaleService } from '../../services/sale.service';
import { Chart } from 'chart.js/auto';
import { CustomerService } from '../../services/customer.service';
import { ISale } from '../../model/sale.model';
import { ITopSupplier } from '../../model/topSupplier';
import { BookingService } from '../../services/booking.service';
import { IBooking } from '../../model/booking.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('salesByMonthChart')
  salesByMonthChart!: ElementRef<HTMLCanvasElement>;

  readonly _saleService = inject(SaleService);
  readonly _customerService = inject(CustomerService);
  readonly _bookingService = inject(BookingService);
  private chartInstance?: Chart;

  totalSales = 0;
  pendingPayments = 0;
  totalCustomers = 0;
  recentSales: ISale[] = [];
  nonPaidBookings: IBooking[] = [];

  ngOnInit(): void {
    this.getTotalSales();
    this.getTotalCustomers();
    this.getRecentSales();
    this.getTopSuppliers();
    this.getPendingPayments();
    this.getNonPaidBookings();
  }
  ngAfterViewInit(): void {
    this.loadSalesByMonthChart();
  }

  loadSalesByMonthChart() {
    this._saleService.getSalesByMonth().subscribe({
      next: (data) => {
        const labels = data.map((d: any) => d.month);
        const totals = data.map((d: any) => d.totalSales);

        const ctx = this.salesByMonthChart.nativeElement.getContext('2d');
        if (!ctx) {
          console.error('❌ No se pudo obtener el contexto 2D del canvas');
          return;
        }

        if (this.chartInstance) {
          this.chartInstance.destroy();
        }

        this.chartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                label: 'Sales (USD)',
                data: totals,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                borderRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: 'Total Sales ($)' },
              },
              x: {
                title: { display: true, text: 'Month' },
              },
            },
          },
        });
      },
      error: (err) => console.error('Error loading chart data:', err),
    });
  }

  getTotalSales(): void {
    this._saleService.getTotalSales().subscribe({
      next: (total) => {
        this.totalSales = total;
      },
      error: (err) => {
        console.error('❌ Error loading total sales:', err);
      },
    });
  }

  getTotalCustomers(): void {
    this._customerService.getTotalCustomers().subscribe({
      next: (total) => {
        this.totalCustomers = total;
      },
      error: (err) => {
        console.error('❌ Error loading total customers:', err);
      },
    });
  }

  getRecentSales() {
    this._saleService.getAllSales().subscribe({
      next: (sales) => {
        this.recentSales = sales.slice(-10);
      },
      error: (err) => {
        console.error('❌ Error loading recent sales:', err);
      },
    });
  }

  topSuppliers: ITopSupplier[] = [];

  getTopSuppliers(): void {
    this._bookingService.getTopSuppliers().subscribe({
      next: (data) => {
        this.topSuppliers = data;
      },
      error: (err) => {
        console.error('❌ Error loading top suppliers:', err);
      },
    });
  }

  getPendingPayments(): void {
    this._saleService.getPendingPayments().subscribe({
      next: (total) => {
        this.pendingPayments = total;
      },
      error: (err) => {
        console.error('❌ Error loading pending payments:', err);
      },
    });
  }

  getNonPaidBookings(): void {
    this._bookingService.getNonPaidBookings().subscribe({
      next: (data) => {
        this.nonPaidBookings = data;
      },
      error: (err) => {
        console.error('❌ Error loading non-paid bookings:', err);
      },
    });
  }
}
