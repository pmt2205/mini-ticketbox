import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Socket, Server } from 'socket.io';
import { TicketService } from '../../ticket/services/ticket.service';
import type { InventoryUpdatedEventDto } from '../dto/inventory-updated-event.dto';

@WebSocketGateway({
  cors: {
    origin: process.env.WEB_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  },
})
export class RealtimeGateway implements OnGatewayConnection {
  private readonly logger = new Logger(RealtimeGateway.name);

  @WebSocketServer()
  private server!: Server;

  constructor(private readonly ticketService: TicketService) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.debug(`Socket connected: ${client.id}`);
    client.emit('inventory.updated', await this.createInventoryPayload());
  }

  async emitInventoryUpdated() {
    this.server.emit('inventory.updated', await this.createInventoryPayload());
  }

  private async createInventoryPayload(): Promise<InventoryUpdatedEventDto> {
    return {
      ticketTypes: await this.ticketService.findMany(),
      serverTime: new Date().toISOString(),
    };
  }
}
