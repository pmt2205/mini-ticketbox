import { TicketTypeResponseDto } from '../../ticket/dto/ticket-type-response.dto';

export type AdminTicketDetailResponseDto = TicketTypeResponseDto & {
  revenue: string;
  activeReservationCount: number;
  seatStatusCounts: {
    available: number;
    held: number;
    sold: number;
  };
};
