import { Injectable, Logger } from '@nestjs/common';
import { RealtimeGateway } from '../gateways/realtime.gateway';

@Injectable()
export class RealtimeService {
  private readonly logger = new Logger(RealtimeService.name);

  constructor(private readonly realtimeGateway: RealtimeGateway) {}

  async publishInventoryUpdated() {
    try {
      await this.realtimeGateway.emitInventoryUpdated();
    } catch (error) {
      this.logger.warn(
        error instanceof Error ? error.message : 'Failed to publish inventory update',
      );
    }
  }
}
