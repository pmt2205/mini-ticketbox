export type AdminPurchaseResponseDto = {
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
