export interface IBooking {
  id: string;
  supplierId: string;
  bookingNumber: string;
  bookingDate: string;
  reservationDate: string;
  description: string;
  amount: number;
  currency: string;
  paid: boolean;
}
