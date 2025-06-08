export interface IBooking {
  id: number;
  supplierId: number;
  supplierName: string;
  bookingNumber: string;
  bookingDate: string;
  reservationDate: string;
  description: string;
  amount: number;
  currency: string;
  paid: boolean;
  saleId: number;
}
