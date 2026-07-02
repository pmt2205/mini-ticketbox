export type TicketType = {
  id: string;
  name: string;
  price: string;
  totalQuantity: number;
  soldQuantity: number;
  heldQuantity: number;
  availableQuantity: number;
};

export type SeatStatus = 'AVAILABLE' | 'HELD' | 'SOLD';

export type Seat = {
  id: string;
  code: string;
  rowLabel: string;
  seatNumber: number;
  status: SeatStatus;
};

export type TicketTypeDetail = TicketType & {
  seats: Seat[];
};

export type ReservationStatus = 'HOLDING' | 'PAID' | 'EXPIRED' | 'CANCELLED';

export type Reservation = {
  id: string;
  ticketTypeId: string;
  userId: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  quantity: number;
  status: ReservationStatus;
  expiresAt: string;
  serverTime: string;
  seats?: Array<{
    id: string;
    code: string;
    rowLabel: string;
    seatNumber: number;
  }>;
};

export type Payment = {
  id: string;
  reservationId: string;
  orderId: string | null;
  status: 'SUCCESS' | 'FAILED';
  provider: string;
  idempotencyKey: string;
  createdAt: string;
  serverTime: string;
  order: {
    id: string;
    reservationId: string;
    userId: string;
    totalAmount: string;
    status: 'PAID' | 'FAILED' | 'CANCELLED';
    createdAt: string;
  } | null;
};

export type PurchaseHistoryItem = {
  paymentId: string;
  orderId: string;
  reservationId: string;
  ticketTypeName: string;
  quantity: number;
  totalAmount: string;
  paymentStatus: 'SUCCESS' | 'FAILED';
  orderStatus: 'PAID' | 'FAILED' | 'CANCELLED';
  reservationStatus: ReservationStatus;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  paidAt: string;
  seats: Array<{
    id: string;
    code: string;
    rowLabel: string;
    seatNumber: number;
  }>;
};

export type AdminStats = {
  totalTickets: number;
  availableTickets: number;
  heldTickets: number;
  soldTickets: number;
  revenue: string;
  activeReservationCount: number;
  ticketTypes: TicketType[];
  serverTime: string;
};

export type AdminActiveReservation = {
  id: string;
  ticketTypeId: string;
  ticketTypeName: string;
  userId: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  quantity: number;
  expiresAt: string;
  createdAt: string;
  remainingSeconds: number;
  totalAmount: string;
  seats: Array<{
    id: string;
    code: string;
    rowLabel: string;
    seatNumber: number;
  }>;
};

export type AdminUser = {
  id: string;
  email: string;
  fullName: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
};

export type AdminPurchase = {
  paymentId: string;
  orderId: string;
  reservationId: string;
  userId: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  ticketTypeName: string;
  quantity: number;
  totalAmount: string;
  paidAt: string;
  seats: Array<{
    id: string;
    code: string;
    rowLabel: string;
    seatNumber: number;
  }>;
};

export type AdminTicketDetail = TicketType & {
  revenue: string;
  activeReservationCount: number;
  seatStatusCounts: {
    available: number;
    held: number;
    sold: number;
  };
};

export type AdminConcert = {
  name: string;
  venue: string;
  totalCapacity: number;
  holdTtlSeconds: number;
  status: 'ACTIVE' | 'SOLD_OUT';
};

export type ApiError = {
  statusCode: number;
  code: string;
  message: string;
  requestId?: string;
  timestamp?: string;
  path?: string;
};
