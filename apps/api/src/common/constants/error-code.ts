export const ERROR_CODE = {
  validationError: 'VALIDATION_ERROR',
  ticketSoldOut: 'TICKET_SOLD_OUT',
  ticketTypeNotFound: 'TICKET_TYPE_NOT_FOUND',
  seatUnavailable: 'SEAT_UNAVAILABLE',
  reservationNotFound: 'RESERVATION_NOT_FOUND',
  reservationExpired: 'RESERVATION_EXPIRED',
  reservationAlreadyPaid: 'RESERVATION_ALREADY_PAID',
  paymentAlreadyProcessed: 'PAYMENT_ALREADY_PROCESSED',
  emailAlreadyUsed: 'EMAIL_ALREADY_USED',
  invalidCredentials: 'INVALID_CREDENTIALS',
  unauthorized: 'UNAUTHORIZED',
  forbidden: 'FORBIDDEN',
  internalServerError: 'INTERNAL_SERVER_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE];
