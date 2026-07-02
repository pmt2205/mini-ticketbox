import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { ERROR_CODE } from '../../../common/constants/error-code';
import { RealtimeService } from '../../realtime/services/realtime.service';
import { PaymentResponseDto } from '../dto/payment-response.dto';
import { PurchaseHistoryResponseDto } from '../dto/purchase-history-response.dto';
import { SimulatePaymentDto } from '../dto/simulate-payment.dto';
import { PaymentRepository } from '../repositories/payment.repository';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly realtimeService: RealtimeService,
  ) {}

  async simulateSuccess(dto: SimulatePaymentDto): Promise<PaymentResponseDto> {
    const result = await this.paymentRepository.processSuccess({
      reservationId: dto.reservationId,
      idempotencyKey: dto.idempotencyKey,
      now: new Date(),
    });

    if (result.error) {
      if (result.error === 'RESERVATION_EXPIRED') {
        await this.realtimeService.publishInventoryUpdated();
      }
      this.throwPaymentError(result.error);
    }

    await this.realtimeService.publishInventoryUpdated();
    return this.toResponse(result.payment!);
  }

  async simulateFailure(dto: SimulatePaymentDto): Promise<PaymentResponseDto> {
    const result = await this.paymentRepository.processFailure({
      reservationId: dto.reservationId,
      idempotencyKey: dto.idempotencyKey,
    });

    if (result.error) {
      this.throwPaymentError(result.error);
    }

    return this.toResponse(result.payment!);
  }

  async findPurchaseHistory(userId: string): Promise<PurchaseHistoryResponseDto[]> {
    const payments = await this.paymentRepository.findPurchaseHistoryByUserId(userId);

    return payments
      .filter((payment) => payment.order)
      .map((payment) => ({
        paymentId: payment.id,
        orderId: payment.order!.id,
        reservationId: payment.reservationId,
        ticketTypeName: payment.reservation.ticketType.name,
        quantity: payment.reservation.quantity,
        totalAmount: payment.order!.totalAmount.toString(),
        paymentStatus: payment.status,
        orderStatus: payment.order!.status,
        reservationStatus: payment.reservation.status,
        customerName: payment.reservation.customerName,
        customerEmail: payment.reservation.customerEmail,
        customerPhone: payment.reservation.customerPhone,
        paidAt: payment.createdAt.toISOString(),
        seats: payment.reservation.seats.map((seat) => ({
          id: seat.id,
          code: seat.code,
          rowLabel: seat.rowLabel,
          seatNumber: seat.seatNumber,
        })),
      }));
  }

  private throwPaymentError(error: string): never {
    if (error === 'RESERVATION_NOT_FOUND') {
      throw new NotFoundException({
        code: ERROR_CODE.reservationNotFound,
        message: 'Reservation not found',
      });
    }

    if (error === 'RESERVATION_ALREADY_PAID') {
      throw new ConflictException({
        code: ERROR_CODE.reservationAlreadyPaid,
        message: 'Reservation has already been paid',
      });
    }

    throw new ConflictException({
      code: ERROR_CODE.reservationExpired,
      message: 'Reservation is expired or no longer payable',
    });
  }

  private toResponse(payment: {
    id: string;
    reservationId: string;
    orderId: string | null;
    provider: string;
    status: PaymentResponseDto['status'];
    idempotencyKey: string;
    createdAt: Date;
    order: {
      id: string;
      reservationId: string;
      userId: string;
      totalAmount: Prisma.Decimal;
      status: OrderStatus;
      createdAt: Date;
    } | null;
  }): PaymentResponseDto {
    return {
      id: payment.id,
      reservationId: payment.reservationId,
      orderId: payment.orderId,
      provider: payment.provider,
      status: payment.status,
      idempotencyKey: payment.idempotencyKey,
      createdAt: payment.createdAt.toISOString(),
      order: payment.order
        ? {
            id: payment.order.id,
            reservationId: payment.order.reservationId,
            userId: payment.order.userId,
            totalAmount: payment.order.totalAmount.toString(),
            status: payment.order.status,
            createdAt: payment.order.createdAt.toISOString(),
          }
        : null,
      serverTime: new Date().toISOString(),
    };
  }
}
