import { IBooking } from './booking.model';
import { ICustomerResponse } from './customerResponse.model';

export interface ISale {
  id: number;
  agentId: number;
  customerResponse: ICustomerResponse;
  creationDate: string;
  travelDate: string;
  amount: number;
  currency: string;
  description: string;
  services: IBooking[];
}
