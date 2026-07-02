import { ConflictException, Injectable, NotFoundException, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ERROR_CODE } from '../../../common/constants/error-code';
import { RealtimeService } from '../../realtime/services/realtime.service';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { CreateSeatReservationDto } from '../dto/create-seat-reservation.dto';
import { ReservationResponseDto } from '../dto/reservation-response.dto';
import { ReservationRepository } from '../repositories/reservation.repository';

@Injectable()
export class ReservationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly reservationRepository: ReservationRepository,
    @Optional() private readonly realtimeService?: RealtimeService,
  ) {}

  async createHold(dto: CreateReservationDto): Promise<ReservationResponseDto> {
    const ttlSeconds = this.configService.get<number>('reservation.ttlSeconds', 300);
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

    try {
      const result = await this.reservationRepository.createHold({
        ticketTypeId: dto.ticketTypeId,
        userId: dto.userId,
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        customerPhone: dto.customerPhone,
        quantity: dto.quantity,
        expiresAt,
      });

      if (!result.reservation) {
        throw new ConflictException({
          code: ERROR_CODE.ticketSoldOut,
          message: 'Not enough tickets available',
        });
      }

      await this.realtimeService?.publishInventoryUpdated();
      return this.toResponse(result.reservation);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      if (error instanceof Error && error.message === 'TICKET_TYPE_NOT_FOUND') {
        throw new NotFoundException({
          code: ERROR_CODE.ticketTypeNotFound,
          message: 'Ticket type not found',
        });
      }

      throw error;
    }
  }

  async createSeatHold(dto: CreateSeatReservationDto): Promise<ReservationResponseDto> {
    const ttlSeconds = this.configService.get<number>('reservation.ttlSeconds', 300);
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

    try {
      const result = await this.reservationRepository.createSeatHold({
        ticketTypeId: dto.ticketTypeId,
        userId: dto.userId,
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        customerPhone: dto.customerPhone,
        seatIds: [...new Set(dto.seatIds)],
        expiresAt,
      });

      if (!result.reservation) {
        throw new ConflictException({
          code: ERROR_CODE.seatUnavailable,
          message: 'One or more selected seats are no longer available',
        });
      }

      await this.realtimeService?.publishInventoryUpdated();
      return this.toResponse(result.reservation);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      if (error instanceof Error && error.message === 'TICKET_TYPE_NOT_FOUND') {
        throw new NotFoundException({
          code: ERROR_CODE.ticketTypeNotFound,
          message: 'Ticket type not found',
        });
      }

      throw error;
    }
  }

  async findById(id: string): Promise<ReservationResponseDto> {
    const reservation = await this.reservationRepository.findById(id);

    if (!reservation) {
      throw new NotFoundException({
        code: ERROR_CODE.reservationNotFound,
        message: 'Reservation not found',
      });
    }

    return this.toResponse(reservation);
  }

  async cancelHold(id: string): Promise<ReservationResponseDto> {
    const reservation = await this.reservationRepository.cancelHold(id);

    if (!reservation) {
      throw new NotFoundException({
        code: ERROR_CODE.reservationNotFound,
        message: 'Reservation not found',
      });
    }

    if (reservation.status === 'CANCELLED') {
      await this.realtimeService?.publishInventoryUpdated();
    }

    return this.toResponse(reservation);
  }

  async releaseExpiredHolds(batchSize: number) {
    const releasedCount = await this.reservationRepository.releaseExpiredHolds(batchSize);

    if (releasedCount > 0) {
      await this.realtimeService?.publishInventoryUpdated();
    }

    return releasedCount;
  }

  private toResponse(reservation: {
    id: string;
    ticketTypeId: string;
    userId: string;
    customerName: string | null;
    customerEmail: string | null;
    customerPhone: string | null;
    quantity: number;
    status: ReservationResponseDto['status'];
    expiresAt: Date;
    seats?: Array<{
      id: string;
      code: string;
      rowLabel: string;
      seatNumber: number;
    }>;
  }): ReservationResponseDto {
    return {
      id: reservation.id,
      ticketTypeId: reservation.ticketTypeId,
      userId: reservation.userId,
      customerName: reservation.customerName,
      customerEmail: reservation.customerEmail,
      customerPhone: reservation.customerPhone,
      quantity: reservation.quantity,
      status: reservation.status,
      expiresAt: reservation.expiresAt.toISOString(),
      serverTime: new Date().toISOString(),
      seats: reservation.seats?.map((seat) => ({
        id: seat.id,
        code: seat.code,
        rowLabel: seat.rowLabel,
        seatNumber: seat.seatNumber,
      })),
    };
  }
}
