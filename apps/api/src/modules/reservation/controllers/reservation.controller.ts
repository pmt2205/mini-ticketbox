import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { CreateSeatReservationDto } from '../dto/create-seat-reservation.dto';
import { ReservationService } from '../services/reservation.service';

const reservationExample = {
  id: '8d2e21c0-3843-44f9-bf13-7562d3d80915',
  ticketTypeId: '1c490497-40d4-4a1c-ae6e-bb868ee422c8',
  userId: 'guest-8ff5ad4f-731d-4e8a-81ee-a45817d3c79c',
  customerName: 'Pham Manh Tuong',
  customerEmail: 'tuong@example.com',
  customerPhone: '0901234567',
  quantity: 2,
  status: 'HOLDING',
  expiresAt: '2026-06-30T13:30:00.000Z',
  serverTime: '2026-06-30T13:25:00.000Z',
  seats: [
    {
      id: '21baf0c6-8bc6-4a59-9f42-7d3d9e64bacc',
      code: 'VIP-A01',
      rowLabel: 'A',
      seatNumber: 1,
    },
  ],
};

@ApiTags('reservations')
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @ApiCreatedResponse({
    description: 'Hold tickets by quantity for the configured reservation TTL.',
    schema: { example: { ...reservationExample, seats: undefined } },
  })
  @ApiConflictResponse({ description: 'Not enough tickets available.' })
  @Post()
  createHold(@Body() dto: CreateReservationDto) {
    return this.reservationService.createHold(dto);
  }

  @ApiCreatedResponse({
    description: 'Hold specific available seats for the configured reservation TTL.',
    schema: { example: reservationExample },
  })
  @ApiConflictResponse({ description: 'One or more selected seats are unavailable.' })
  @Post('seats')
  createSeatHold(@Body() dto: CreateSeatReservationDto) {
    return this.reservationService.createSeatHold(dto);
  }

  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({
    description: 'Return reservation details and server time for countdown sync.',
    schema: { example: reservationExample },
  })
  @ApiNotFoundResponse({ description: 'Reservation not found.' })
  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservationService.findById(id);
  }

  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({
    description: 'Cancel a holding reservation and release held seats.',
    schema: { example: { ...reservationExample, status: 'CANCELLED' } },
  })
  @ApiNotFoundResponse({ description: 'Reservation not found.' })
  @Delete(':id')
  cancelHold(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservationService.cancelHold(id);
  }
}
