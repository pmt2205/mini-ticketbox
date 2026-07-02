import { Injectable } from '@nestjs/common';
import { Prisma, ReservationStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

type LockedReservation = {
  id: string;
  ticketTypeId: string;
  userId: string;
  quantity: number;
  status: ReservationStatus;
  expiresAt: Date;
};

type RawReservationRow = {
  id: string;
  ticket_type_id: string;
  user_id: string;
  quantity: number;
  status: ReservationStatus;
  expires_at: Date;
};

@Injectable()
export class PaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  processSuccess(params: { reservationId: string; idempotencyKey: string; now: Date }) {
    return this.prisma.$transaction(
      async (tx) => {
        const existingPayment = await tx.payment.findUnique({
          where: { idempotencyKey: params.idempotencyKey },
          include: { order: true },
        });

        if (existingPayment) {
          return { payment: existingPayment, error: null as PaymentError | null };
        }

        const reservation = await this.lockReservation(tx, params.reservationId);

        if (!reservation) {
          return { payment: null, error: 'RESERVATION_NOT_FOUND' as PaymentError };
        }

        if (reservation.status === 'PAID') {
          return { payment: null, error: 'RESERVATION_ALREADY_PAID' as PaymentError };
        }

        if (reservation.status !== 'HOLDING') {
          return { payment: null, error: 'RESERVATION_EXPIRED' as PaymentError };
        }

        if (reservation.expiresAt <= params.now) {
          await this.expireReservation(tx, reservation);
          return { payment: null, error: 'RESERVATION_EXPIRED' as PaymentError };
        }

        const ticketType = await tx.ticketType.findUniqueOrThrow({
          where: { id: reservation.ticketTypeId },
          select: { price: true },
        });
        const totalAmount = new Prisma.Decimal(ticketType.price).mul(reservation.quantity);

        await tx.reservation.update({
          where: { id: reservation.id },
          data: { status: 'PAID' },
        });

        await tx.ticketType.update({
          where: { id: reservation.ticketTypeId },
          data: {
            heldQuantity: { decrement: reservation.quantity },
            soldQuantity: { increment: reservation.quantity },
          },
        });

        await tx.seat.updateMany({
          where: {
            reservationId: reservation.id,
            status: 'HELD',
          },
          data: { status: 'SOLD' },
        });

        const order = await tx.order.create({
          data: {
            reservationId: reservation.id,
            userId: reservation.userId,
            totalAmount,
            status: 'PAID',
          },
        });

        const payment = await tx.payment.create({
          data: {
            orderId: order.id,
            reservationId: reservation.id,
            provider: 'SIMULATED_MODAL',
            status: 'SUCCESS',
            idempotencyKey: params.idempotencyKey,
          },
          include: { order: true },
        });

        return { payment, error: null as PaymentError | null };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
        timeout: 10_000,
      },
    );
  }

  processFailure(params: { reservationId: string; idempotencyKey: string }) {
    return this.prisma.$transaction(async (tx) => {
      const existingPayment = await tx.payment.findUnique({
        where: { idempotencyKey: params.idempotencyKey },
        include: { order: true },
      });

      if (existingPayment) {
        return { payment: existingPayment, error: null as PaymentError | null };
      }

      const reservation = await tx.reservation.findUnique({
        where: { id: params.reservationId },
        select: { id: true },
      });

      if (!reservation) {
        return { payment: null, error: 'RESERVATION_NOT_FOUND' as PaymentError };
      }

      const payment = await tx.payment.create({
        data: {
          reservationId: params.reservationId,
          provider: 'SIMULATED_MODAL',
          status: 'FAILED',
          idempotencyKey: params.idempotencyKey,
        },
        include: { order: true },
      });

      return { payment, error: null as PaymentError | null };
    });
  }

  findPurchaseHistoryByUserId(userId: string) {
    return this.prisma.payment.findMany({
      where: {
        status: 'SUCCESS',
        order: {
          userId,
        },
      },
      include: {
        order: true,
        reservation: {
          include: {
            ticketType: true,
            seats: {
              orderBy: [{ rowLabel: 'asc' }, { seatNumber: 'asc' }],
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  private async expireReservation(tx: Prisma.TransactionClient, reservation: LockedReservation) {
    await tx.reservation.update({
      where: { id: reservation.id },
      data: { status: 'EXPIRED' },
    });

    await tx.ticketType.update({
      where: { id: reservation.ticketTypeId },
      data: {
        heldQuantity: { decrement: reservation.quantity },
      },
    });

    await tx.seat.updateMany({
      where: {
        reservationId: reservation.id,
        status: 'HELD',
      },
      data: {
        status: 'AVAILABLE',
        reservationId: null,
      },
    });
  }

  private async lockReservation(
    tx: Prisma.TransactionClient,
    reservationId: string,
  ): Promise<LockedReservation | null> {
    const reservationUuidParam = Prisma.sql`${reservationId}::uuid`;

    const rows = await tx.$queryRaw<RawReservationRow[]>`
      SELECT *
      FROM reservations
      WHERE id = ${reservationUuidParam}
      FOR UPDATE
    `;

    if (!rows[0]) {
      return null;
    }

    return {
      id: rows[0].id,
      ticketTypeId: rows[0].ticket_type_id,
      userId: rows[0].user_id,
      quantity: rows[0].quantity,
      status: rows[0].status,
      expiresAt: rows[0].expires_at,
    };
  }
}

type PaymentError = 'RESERVATION_NOT_FOUND' | 'RESERVATION_ALREADY_PAID' | 'RESERVATION_EXPIRED';
