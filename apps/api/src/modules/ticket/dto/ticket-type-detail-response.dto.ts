import { SeatStatus } from '@prisma/client';
import { TicketTypeResponseDto } from './ticket-type-response.dto';

export type SeatResponseDto = {
  id: string;
  code: string;
  rowLabel: string;
  seatNumber: number;
  status: SeatStatus;
};

export type TicketTypeDetailResponseDto = TicketTypeResponseDto & {
  seats: SeatResponseDto[];
};
