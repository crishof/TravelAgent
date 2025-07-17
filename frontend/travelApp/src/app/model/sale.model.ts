import { IBooking } from './booking.model';
import { ICustomerResponse } from './customerResponse.model';
import { IUserResponse } from './userResponse.model';

export interface ISale {
  id: number;
  userResponse: IUserResponse;
  customerResponse: ICustomerResponse;
  creationDate: string;
  travelDate: string;
  amount: number;
  currency: string;
  description: string;
  services: IBooking[];
}
