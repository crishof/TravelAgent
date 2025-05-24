export interface ICustomerPayment {
  id: number;
  customerId: number;
  travelId: number;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentDate: string;
  exchangeRate: number;
  amountInSaleCurrency: number;
  saleCurrency: string;
}
