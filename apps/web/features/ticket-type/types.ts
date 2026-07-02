import type { Seat } from '../../types/ticket';

export type CustomerForm = {
  name: string;
  email: string;
  phone: string;
};

export type SeatRow = {
  rowLabel: string;
  seats: Seat[];
};

export type HoldSeatsInput = {
  ticketTypeId: string;
  userId: string;
  customer: CustomerForm;
  seatIds: string[];
};
