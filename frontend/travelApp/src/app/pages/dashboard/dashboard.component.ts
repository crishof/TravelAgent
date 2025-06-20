import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  totalSales = 125000;
  pendingPayments = 18500;
  totalCustomers = 320;

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

  ngOnInit(): void {}
}
