import { IBooking } from './booking.model';

export interface ISale {
  id: number;
  agentId: number;
  creationDate: string;
  travelDate: string;
  amount: number;
  currency: string;
  description: string;
  services: IBooking[];
}
