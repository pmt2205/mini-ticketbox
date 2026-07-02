import { ReservationStatus } from '@prisma/client';

export type ReservationResponseDto = {
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
