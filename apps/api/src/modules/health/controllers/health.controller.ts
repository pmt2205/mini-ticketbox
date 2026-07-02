import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @ApiOkResponse({
    schema: {
      example: {
        status: 'ok',
        service: 'mini-ticketbox-api',
        serverTime: '2026-06-30T13:22:13.347Z',
      },
    },
  })
  @Get()
  getHealth() {
    return {
      status: 'ok',
      service: 'mini-ticketbox-api',
      serverTime: new Date().toISOString(),
    };
  }
}
