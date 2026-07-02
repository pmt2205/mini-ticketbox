import { Controller, Delete, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { AdminService } from '../services/admin.service';

@ApiTags('admin')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Authentication required.' })
@UseGuards(AuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOkResponse({ description: 'Return ticket inventory, sold count, revenue, and hold totals.' })
  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @ApiOkResponse({ description: 'Return active holding reservations waiting for payment.' })
  @Get('active-reservations')
  getActiveReservations() {
    return this.adminService.getActiveReservations();
  }

  @ApiOkResponse({ description: 'Return registered users for admin management.' })
  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

  @ApiOkResponse({ description: 'Return paid buyers and purchased tickets.' })
  @Get('purchases')
  getPurchases() {
    return this.adminService.getPurchases();
  }

  @ApiOkResponse({ description: 'Return ticket type management details.' })
  @Get('ticket-details')
  getTicketDetails() {
    return this.adminService.getTicketDetails();
  }

  @ApiOkResponse({ description: 'Return current concert configuration summary.' })
  @Get('concert')
  getConcert() {
    return this.adminService.getConcert();
  }

  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Cancel an active holding reservation and release held tickets.' })
  @Delete('reservations/:id')
  cancelReservation(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.cancelReservation(id);
  }
}
