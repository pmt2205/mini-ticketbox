export const RESERVATION_STATUSES = ['HOLDING', 'PAID', 'EXPIRED', 'CANCELLED'] as const;

export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];
