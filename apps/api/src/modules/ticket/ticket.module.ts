import { Module } from '@nestjs/common';
import { TicketController } from './controllers/ticket.controller';
import { TicketRepository } from './repositories/ticket.repository';
import { TicketService } from './services/ticket.service';

@Module({
  controllers: [TicketController],
  providers: [TicketRepository, TicketService],
  exports: [TicketService],
})
export class TicketModule {}
