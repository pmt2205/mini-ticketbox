import { Injectable, NotFoundException } from '@nestjs/common';
import { ERROR_CODE } from '../../../common/constants/error-code';
import { TicketTypeDetailResponseDto } from '../dto/ticket-type-detail-response.dto';
import { TicketTypeResponseDto } from '../dto/ticket-type-response.dto';
import { TicketRepository } from '../repositories/ticket.repository';

@Injectable()
export class TicketService {
  constructor(private readonly ticketRepository: TicketRepository) {}

  async findMany(): Promise<TicketTypeResponseDto[]> {
    const ticketTypes = await this.ticketRepository.findMany();
    return ticketTypes.map((ticketType) => this.toResponse(ticketType));
  }

  async findDetailById(id: string): Promise<TicketTypeDetailResponseDto> {
    const ticketType = await this.ticketRepository.findDetailById(id);

    if (!ticketType) {
      throw new NotFoundException({
        code: ERROR_CODE.ticketTypeNotFound,
        message: 'Ticket type not found',
      });
    }

    return {
      ...this.toResponse(ticketType),
      seats: ticketType.seats.map((seat) => ({
        id: seat.id,
        code: seat.code,
        rowLabel: seat.rowLabel,
        seatNumber: seat.seatNumber,
        status: seat.status,
      })),
    };
  }

  private toResponse(ticketType: {
    id: string;
    name: string;
    price: { toString(): string };
    totalQuantity: number;
    soldQuantity: number;
    heldQuantity: number;
  }): TicketTypeResponseDto {
    return {
      id: ticketType.id,
      name: ticketType.name,
      price: ticketType.price.toString(),
      totalQuantity: ticketType.totalQuantity,
      soldQuantity: ticketType.soldQuantity,
      heldQuantity: ticketType.heldQuantity,
      availableQuantity:
        ticketType.totalQuantity - ticketType.soldQuantity - ticketType.heldQuantity,
    };
  }
}
