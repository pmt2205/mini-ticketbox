import { TicketTypeResponseDto } from '../../ticket/dto/ticket-type-response.dto';

export type InventoryUpdatedEventDto = {
  ticketTypes: TicketTypeResponseDto[];
  serverTime: string;
};
