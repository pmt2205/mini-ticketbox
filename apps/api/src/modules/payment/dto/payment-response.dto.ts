import { OrderStatus, PaymentStatus } from '@prisma/client';

export type PaymentResponseDto = {
  id: string;
  reservationId: string;
  orderId: string | null;
  status: PaymentStatus;
  provider: string;
  idempotencyKey: string;
  createdAt: string;
  order: {
    id: string;
    reservationId: string;
    userId: string;
    totalAmount: string;
    status: OrderStatus;
    createdAt: string;
  } | null;
  serverTime: string;
};
