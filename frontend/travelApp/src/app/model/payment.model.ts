export interface IPayment {
  bookingId: number;
  paymentDate: string; // ISO date string
  amount: number;
  currency: string;
  description: string;
}
