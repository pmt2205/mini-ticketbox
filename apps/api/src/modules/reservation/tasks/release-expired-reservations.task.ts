import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { ReservationService } from '../services/reservation.service';

@Injectable()
export class ReleaseExpiredReservationsTask {
  private readonly logger = new Logger(ReleaseExpiredReservationsTask.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly reservationService: ReservationService,
  ) {}

  @Cron(process.env.RESERVATION_RELEASE_CRON ?? '*/15 * * * * *')
  async handle() {
    const batchSize = this.configService.get<number>('reservation.releaseBatchSize', 100);
    const releasedCount = await this.reservationService.releaseExpiredHolds(batchSize);

    if (releasedCount > 0) {
      this.logger.log(`Released ${releasedCount} expired held tickets`);
    }
  }
}
