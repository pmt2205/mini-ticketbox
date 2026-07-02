import { Module } from '@nestjs/common';
import { TicketModule } from '../ticket/ticket.module';
import { RealtimeGateway } from './gateways/realtime.gateway';
import { RealtimeService } from './services/realtime.service';

@Module({
  imports: [TicketModule],
  providers: [RealtimeGateway, RealtimeService],
  exports: [RealtimeService],
})
export class RealtimeModule {}
