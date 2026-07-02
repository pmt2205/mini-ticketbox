import { ConfigService } from '@nestjs/config';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationRepository } from '../repositories/reservation.repository';

const createRepository = () =>
  ({
    createHold: jest.fn(),
    findById: jest.fn(),
    cancelHold: jest.fn(),
    releaseExpiredHolds: jest.fn(),
  }) as unknown as jest.Mocked<ReservationRepository>;

describe('ReservationService', () => {
  const configService = {
    get: jest.fn((key: string, fallback: number) =>
      key === 'reservation.ttlSeconds' ? 300 : fallback,
    ),
  } as unknown as ConfigService;

  it('creates a hold with server-owned expiry', async () => {
    const repository = createRepository();
    const service = new ReservationService(configService, repository);
    const expiresAt = new Date(Date.now() + 300_000);

    repository.createHold.mockResolvedValue({
      availableQuantity: 9,
      reservation: {
        id: 'bfa219c0-f450-4d67-a0b4-52ebd4e455d2',
        ticketTypeId: 'a5e3f022-f891-42b4-a8ed-d6f14f526bf0',
        userId: 'user-1',
        customerName: 'Postman User',
        customerEmail: 'postman@example.com',
        customerPhone: '0901234567',
        quantity: 1,
        status: 'HOLDING',
        expiresAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const result = await service.createHold({
      ticketTypeId: 'a5e3f022-f891-42b4-a8ed-d6f14f526bf0',
      userId: 'user-1',
      customerName: 'Postman User',
      customerEmail: 'postman@example.com',
      customerPhone: '0901234567',
      quantity: 1,
    });

    expect(repository.createHold).toHaveBeenCalledWith(
      expect.objectContaining({
        ticketTypeId: 'a5e3f022-f891-42b4-a8ed-d6f14f526bf0',
        userId: 'user-1',
        customerName: 'Postman User',
        customerEmail: 'postman@example.com',
        customerPhone: '0901234567',
        quantity: 1,
      }),
    );
    expect(result.status).toBe('HOLDING');
    expect(result.expiresAt).toBe(expiresAt.toISOString());
  });

  it('throws conflict when inventory is not enough', async () => {
    const repository = createRepository();
    const service = new ReservationService(configService, repository);

    repository.createHold.mockResolvedValue({
      availableQuantity: 0,
      reservation: null,
    });

    await expect(
      service.createHold({
        ticketTypeId: 'a5e3f022-f891-42b4-a8ed-d6f14f526bf0',
        userId: 'user-1',
        customerName: 'Postman User',
        customerEmail: 'postman@example.com',
        customerPhone: '0901234567',
        quantity: 1,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws not found when reservation does not exist', async () => {
    const repository = createRepository();
    const service = new ReservationService(configService, repository);

    repository.findById.mockResolvedValue(null);

    await expect(service.findById('bfa219c0-f450-4d67-a0b4-52ebd4e455d2')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('delegates expired hold release to repository', async () => {
    const repository = createRepository();
    const service = new ReservationService(configService, repository);

    repository.releaseExpiredHolds.mockResolvedValue(12);

    await expect(service.releaseExpiredHolds(100)).resolves.toBe(12);
    expect(repository.releaseExpiredHolds).toHaveBeenCalledWith(100);
  });
});
