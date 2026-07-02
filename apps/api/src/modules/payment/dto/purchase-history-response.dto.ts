import { OrderStatus, PaymentStatus, ReservationStatus } from '@prisma/client';

export type PurchaseHistoryResponseDto = {
  paymentId: string;
  orderId: string;
  reservationId: string;
  ticketTypeName: string;
  quantity: number;
  totalAmount: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
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
