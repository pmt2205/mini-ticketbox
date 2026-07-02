import { Module } from '@nestjs/common';
import { RealtimeModule } from '../realtime/realtime.module';
import { ReservationController } from './controllers/reservation.controller';
import { ReservationRepository } from './repositories/reservation.repository';
import { ReservationService } from './services/reservation.service';
import { ReleaseExpiredReservationsTask } from './tasks/release-expired-reservations.task';

@Module({
  imports: [RealtimeModule],
  controllers: [ReservationController],
  providers: [ReservationRepository, ReservationService, ReleaseExpiredReservationsTask],
  exports: [ReservationService],
})
export class ReservationModule {}
