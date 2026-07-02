import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class TicketRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany() {
    return this.prisma.ticketType.findMany({
      orderBy: { price: 'desc' },
    });
  }

  findById(id: string) {
    return this.prisma.ticketType.findUnique({
      where: { id },
    });
  }

  findDetailById(id: string) {
    return this.prisma.ticketType.findUnique({
      where: { id },
      include: {
        seats: {
          orderBy: [{ rowLabel: 'asc' }, { seatNumber: 'asc' }],
        },
      },
    });
  }
}
