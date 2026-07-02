import { Injectable } from '@nestjs/common';
import { Prisma, ReservationStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

type LockedTicketType = {
  id: string;
  totalQuantity: number;
  soldQuantity: number;
  heldQuantity: number;
};

type LockedReservation = {
  id: string;
  ticketTypeId: string;
  userId: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  quantity: number;
  status: ReservationStatus;
  expiresAt: Date;
};

type RawTicketTypeRow = {
  id: string;
  total_quantity: number;
  sold_quantity: number;
  held_quantity: number;
};

type RawReservationRow = {
  id: string;
  ticket_type_id: string;
  user_id: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  quantity: number;
  status: ReservationStatus;
  expires_at: Date;
};

type RawSeatRow = {
  id: string;
  ticket_type_id: string;
  status: 'AVAILABLE' | 'HELD' | 'SOLD';
};

type ExpiredHoldGroup = {
  ticketTypeId: string;
  quantity: number | bigint;
};

@Injectable()
export class ReservationRepository {
  constructor(private readonly prisma: PrismaService) {}

  createHold(params: {
    ticketTypeId: string;
    userId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    quantity: number;
    expiresAt: Date;
  }) {
    return this.prisma.$transaction(
      async (tx) => {
        const ticketType = await this.lockTicketType(tx, params.ticketTypeId);
        const availableQuantity =
          ticketType.totalQuantity - ticketType.soldQuantity - ticketType.heldQuantity;

        if (availableQuantity < params.quantity) {
          return { reservation: null, availableQuantity };
        }

        await tx.ticketType.update({
          where: { id: params.ticketTypeId },
          data: {
            heldQuantity: {
              increment: params.quantity,
            },
          },
        });

        const reservation = await tx.reservation.create({
          data: {
            ticketTypeId: params.ticketTypeId,
            userId: params.userId,
            customerName: params.customerName,
            customerEmail: params.customerEmail,
            customerPhone: params.customerPhone,
            quantity: params.quantity,
            expiresAt: params.expiresAt,
          },
        });

        return { reservation, availableQuantity: availableQuantity - params.quantity };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
        timeout: 10_000,
      },
    );
  }

  findById(id: string) {
    return this.prisma.reservation.findUnique({
      where: { id },
      include: {
        seats: {
          orderBy: [{ rowLabel: 'asc' }, { seatNumber: 'asc' }],
        },
      },
    });
  }

  createSeatHold(params: {
    ticketTypeId: string;
    userId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    seatIds: string[];
    expiresAt: Date;
  }) {
    return this.prisma.$transaction(
      async (tx) => {
        await this.lockTicketType(tx, params.ticketTypeId);
        const seats = await this.lockSeats(tx, params.seatIds);
        const uniqueSeatIds = new Set(params.seatIds);

        if (
          seats.length !== uniqueSeatIds.size ||
          seats.some((seat) => seat.ticket_type_id !== params.ticketTypeId || seat.status !== 'AVAILABLE')
        ) {
          return { reservation: null, unavailableSeatIds: params.seatIds };
        }

        await tx.ticketType.update({
          where: { id: params.ticketTypeId },
          data: {
            heldQuantity: {
              increment: seats.length,
            },
          },
        });

        const reservation = await tx.reservation.create({
          data: {
            ticketTypeId: params.ticketTypeId,
            userId: params.userId,
            customerName: params.customerName,
            customerEmail: params.customerEmail,
            customerPhone: params.customerPhone,
            quantity: seats.length,
            expiresAt: params.expiresAt,
          },
          include: {
            seats: true,
          },
        });

        await tx.seat.updateMany({
          where: {
            id: {
              in: params.seatIds,
            },
          },
          data: {
            status: 'HELD',
            reservationId: reservation.id,
          },
        });

        return {
          reservation: {
            ...reservation,
            seats: await tx.seat.findMany({
              where: { reservationId: reservation.id },
              orderBy: [{ rowLabel: 'asc' }, { seatNumber: 'asc' }],
            }),
          },
          unavailableSeatIds: [],
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
        timeout: 10_000,
      },
    );
  }

  cancelHold(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const reservation = await this.lockReservation(tx, id);

      if (!reservation || reservation.status !== 'HOLDING') {
        return reservation;
      }

      await tx.reservation.update({
        where: { id },
        data: { status: 'CANCELLED' },
      });

      await tx.seat.updateMany({
        where: {
          reservationId: id,
          status: 'HELD',
        },
        data: {
          status: 'AVAILABLE',
          reservationId: null,
        },
      });

      await tx.ticketType.update({
        where: { id: reservation.ticketTypeId },
        data: {
          heldQuantity: {
            decrement: reservation.quantity,
          },
        },
      });

      return { ...reservation, status: 'CANCELLED' as const };
    });
  }

  releaseExpiredHolds(batchSize: number) {
    return this.prisma.$transaction(async (tx) => {
      const groups = await tx.$queryRaw<ExpiredHoldGroup[]>`
        WITH expired AS (
          SELECT id, ticket_type_id, quantity
          FROM reservations
          WHERE status = 'HOLDING'
            AND expires_at <= NOW()
          ORDER BY expires_at ASC
          LIMIT ${batchSize}
          FOR UPDATE SKIP LOCKED
        ),
        updated AS (
          UPDATE reservations AS r
          SET status = 'EXPIRED',
              updated_at = NOW()
          FROM expired AS e
          WHERE r.id = e.id
          RETURNING e.ticket_type_id, e.quantity
        )
        SELECT ticket_type_id AS "ticketTypeId", SUM(quantity)::int AS quantity
        FROM updated
        GROUP BY ticket_type_id
      `;

      for (const group of groups) {
        await tx.ticketType.update({
          where: { id: group.ticketTypeId },
          data: {
            heldQuantity: {
              decrement: Number(group.quantity),
            },
          },
        });
      }

      await tx.seat.updateMany({
        where: {
          reservation: {
            status: 'EXPIRED',
          },
          status: 'HELD',
        },
        data: {
          status: 'AVAILABLE',
          reservationId: null,
        },
      });

      return groups.reduce((total, group) => total + Number(group.quantity), 0);
    });
  }

  private async lockSeats(tx: Prisma.TransactionClient, seatIds: string[]): Promise<RawSeatRow[]> {
    const seatUuidParams = seatIds.map((seatId) => Prisma.sql`${seatId}::uuid`);

    return tx.$queryRaw<RawSeatRow[]>`
      SELECT id, ticket_type_id, status
      FROM seats
      WHERE id IN (${Prisma.join(seatUuidParams)})
      FOR UPDATE
    `;
  }

  private async lockTicketType(
    tx: Prisma.TransactionClient,
    ticketTypeId: string,
  ): Promise<LockedTicketType> {
    const ticketTypeUuidParam = Prisma.sql`${ticketTypeId}::uuid`;

    const rows = await tx.$queryRaw<RawTicketTypeRow[]>`
      SELECT *
      FROM ticket_types
      WHERE id = ${ticketTypeUuidParam}
      FOR UPDATE
    `;

    if (!rows[0]) {
      throw new Error('TICKET_TYPE_NOT_FOUND');
    }

    return {
      id: rows[0].id,
      totalQuantity: rows[0].total_quantity,
      soldQuantity: rows[0].sold_quantity,
      heldQuantity: rows[0].held_quantity,
    };
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
      customerName: rows[0].customer_name,
      customerEmail: rows[0].customer_email,
      customerPhone: rows[0].customer_phone,
      quantity: rows[0].quantity,
      status: rows[0].status,
      expiresAt: rows[0].expires_at,
    };
  }
}
