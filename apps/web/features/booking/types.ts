import type { Reservation, TicketType } from '../../types/ticket';

export type PaymentMode = 'success' | 'failure';

export type PaymentResult = {
  mode: PaymentMode;
  orderId?: string;
} | null;

export type LoadedReservationPayload = {
  reservation: Reservation;
  ticketTypes: TicketType[];
};

export type SimulatedPaymentPayload = {
  paymentResult: PaymentResult;
  paymentMessage: string;
  reservation?: Reservation;
  ticketTypes?: TicketType[];
};

export type SimulatedPaymentArgs = {
  mode: PaymentMode;
  reservation: Reservation;
};
