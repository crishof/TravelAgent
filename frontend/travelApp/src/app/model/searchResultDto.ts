import { IBooking } from './booking.model';
import { ICustomer } from './customer.model';

export interface ISearchResultDTO {
  type: 'Customer' | 'Booking' | 'none';
  results: ICustomer[] | IBooking[];
}
