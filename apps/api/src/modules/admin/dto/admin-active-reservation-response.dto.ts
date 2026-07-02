export type AdminActiveReservationResponseDto = {
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
