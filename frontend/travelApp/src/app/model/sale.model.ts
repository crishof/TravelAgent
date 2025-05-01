import { IBooking } from './booking.model';
import { ICustomer } from './customer.model';

export interface ISale {
  id: number;
  agentId: number;
  customer: ICustomer;
  creationDate: string;
  travelDate: string;
  amount: number;
  currency: string;
  description: string;
  services: IBooking[];
}
