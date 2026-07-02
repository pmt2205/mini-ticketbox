import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/modules/auth/utils/password.util';

const prisma = new PrismaClient();

async function main() {
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.ticketType.deleteMany();

  const ticketTypes = await Promise.all([
    prisma.ticketType.create({
      data: {
        name: 'VIP',
        price: '2500000',
        totalQuantity: 100,
      },
    }),
    prisma.ticketType.create({
      data: {
        name: 'Standard',
        price: '1200000',
        totalQuantity: 300,
      },
    }),
    prisma.ticketType.create({
      data: {
        name: 'Economy',
        price: '650000',
        totalQuantity: 100,
      },
    }),
  ]);

  for (const ticketType of ticketTypes) {
    await prisma.seat.createMany({
      data: buildSeats(ticketType.id, ticketType.name, ticketType.totalQuantity),
    });
  }

  await prisma.user.upsert({
    where: { email: 'admin@mini-ticketbox.local' },
    update: {
      fullName: 'Mini Ticketbox Admin',
      role: 'ADMIN',
    },
    create: {
      email: 'admin@mini-ticketbox.local',
      fullName: 'Mini Ticketbox Admin',
      role: 'ADMIN',
      passwordHash: await hashPassword('Admin@123456'),
    },
  });
}

function buildSeats(ticketTypeId: string, ticketTypeName: string, totalQuantity: number) {
  const seatsPerRow = ticketTypeName === 'Standard' ? 20 : 10;

  return Array.from({ length: totalQuantity }, (_, index) => {
    const rowIndex = Math.floor(index / seatsPerRow);
    const rowLabel = String.fromCharCode('A'.charCodeAt(0) + rowIndex);
    const seatNumber = (index % seatsPerRow) + 1;
    const prefix = ticketTypeName.slice(0, 3).toUpperCase();

    return {
      ticketTypeId,
      rowLabel,
      seatNumber,
      code: `${prefix}-${rowLabel}${seatNumber.toString().padStart(2, '0')}`,
    };
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
