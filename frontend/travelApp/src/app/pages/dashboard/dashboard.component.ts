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
  private chartInstance?: Chart;

  totalSales = 125000;
  pendingPayments = 18500;
  totalCustomers = 320;

  ngOnInit(): void {
    this.getTotalSales();
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

  recentSales = [
    { date: new Date(), customer: 'John Doe', amount: 1200, status: 'Paid' },
    {
      date: new Date(),
      customer: 'Jane Smith',
      amount: 950,
      status: 'Pending',
    },
    { date: new Date(), customer: 'Carlos Ruiz', amount: 2100, status: 'Paid' },
    { date: new Date(), customer: 'Anna Lee', amount: 750, status: 'Pending' },
  ];

  topSuppliers = [
    { name: 'Global Travels', bookings: 42 },
    { name: 'Sunshine Tours', bookings: 37 },
    { name: 'Adventure Co.', bookings: 29 },
  ];

  topAgents = [
    { name: 'Alice Brown', sales: 34, total: 34000 },
    { name: 'Test Brown', sales: 34, total: 34000 },
    { name: 'Bob White', sales: 28, total: 28000 },
    { name: 'Maria Green', sales: 22, total: 22000 },
  ];
}
