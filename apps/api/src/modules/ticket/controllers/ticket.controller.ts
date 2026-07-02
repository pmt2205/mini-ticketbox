import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { TicketService } from '../services/ticket.service';

@ApiTags('ticket-types')
@Controller('ticket-types')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @ApiOkResponse({
    description: 'List ticket types with aggregated inventory.',
    schema: {
      example: [
        {
          id: '1c490497-40d4-4a1c-ae6e-bb868ee422c8',
          name: 'VIP',
          price: '2500000',
          totalQuantity: 100,
          soldQuantity: 12,
          heldQuantity: 4,
          availableQuantity: 84,
        },
      ],
    },
  })
  @Get()
  findMany() {
    return this.ticketService.findMany();
  }

  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({
    description: 'Ticket type detail with seat map.',
    schema: {
      example: {
        id: '1c490497-40d4-4a1c-ae6e-bb868ee422c8',
        name: 'VIP',
        price: '2500000',
        totalQuantity: 100,
        soldQuantity: 12,
        heldQuantity: 4,
        availableQuantity: 84,
        seats: [
          {
            id: '21baf0c6-8bc6-4a59-9f42-7d3d9e64bacc',
            code: 'VIP-A01',
            rowLabel: 'A',
            seatNumber: 1,
            status: 'AVAILABLE',
          },
        ],
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Ticket type not found.' })
  @Get(':id')
  findDetailById(@Param('id', ParseUUIDPipe) id: string) {
    return this.ticketService.findDetailById(id);
  }
}
