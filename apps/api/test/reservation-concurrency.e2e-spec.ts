import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';

describe('Reservation concurrency', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = app.get(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('does not over-hold under concurrent requests', async () => {
    await prisma.reservation.deleteMany();
    await prisma.ticketType.deleteMany();

    const ticketType = await prisma.ticketType.create({
      data: {
        name: 'Concurrency Test',
        price: '100000',
        totalQuantity: 50,
      },
    });

    const attempts = Array.from({ length: 100 }, (_, index) =>
      request(app.getHttpServer())
        .post('/reservations')
        .send({
          ticketTypeId: ticketType.id,
          userId: `user-${index}`,
          quantity: 1,
        }),
    );

    const responses = (await Promise.all(attempts)) as Array<{ status: number }>;
    const successCount = responses.filter((response) => response.status === 201).length;
    const conflictCount = responses.filter((response) => response.status === 409).length;
    const reloaded = await prisma.ticketType.findUniqueOrThrow({
      where: { id: ticketType.id },
    });

    expect(successCount).toBe(50);
    expect(conflictCount).toBe(50);
    expect(reloaded.heldQuantity + reloaded.soldQuantity).toBeLessThanOrEqual(
      reloaded.totalQuantity,
    );
    expect(reloaded.heldQuantity).toBe(50);
  });
});
