import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class AdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  findTicketTypes() {
    return this.prisma.ticketType.findMany({
      orderBy: { price: 'desc' },
    });
  }

  getPaidRevenue() {
    return this.prisma.order.aggregate({
      where: { status: 'PAID' },
      _sum: { totalAmount: true },
    });
  }

  countActiveReservations(now: Date) {
    return this.prisma.reservation.count({
      where: {
        status: 'HOLDING',
        expiresAt: { gt: now },
      },
    });
  }

  findActiveReservations(now: Date) {
    return this.prisma.reservation.findMany({
      where: {
        status: 'HOLDING',
        expiresAt: { gt: now },
      },
      include: {
        ticketType: true,
        seats: {
          orderBy: [{ rowLabel: 'asc' }, { seatNumber: 'asc' }],
        },
      },
      orderBy: { expiresAt: 'asc' },
    });
  }

  findUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findPaidPurchases() {
    return this.prisma.payment.findMany({
      where: {
        status: 'SUCCESS',
        order: {
          isNot: null,
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
      orderBy: { createdAt: 'desc' },
    });
  }

  findTicketDetails() {
    return this.prisma.ticketType.findMany({
      include: {
        seats: true,
        reservations: {
          where: { status: 'HOLDING' },
          select: { id: true },
        },
      },
      orderBy: { price: 'desc' },
    });
  }
}
