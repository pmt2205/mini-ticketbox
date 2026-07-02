import { TicketTypeResponseDto } from '../../ticket/dto/ticket-type-response.dto';

export type AdminStatsResponseDto = {
  totalTickets: number;
  availableTickets: number;
  heldTickets: number;
  soldTickets: number;
  revenue: string;
  activeReservationCount: number;
  ticketTypes: TicketTypeResponseDto[];
  serverTime: string;
};
