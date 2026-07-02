import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthenticatedRequest, AuthGuard } from '../../auth/guards/auth.guard';
import { SimulatePaymentDto } from '../dto/simulate-payment.dto';
import { PaymentService } from '../services/payment.service';

const paymentExample = {
  id: '0d97cf7d-3e67-4686-8acd-9f75c57887fb',
  reservationId: '8d2e21c0-3843-44f9-bf13-7562d3d80915',
  orderId: '6d06342a-f98f-4de9-8da9-b425b285b37a',
  status: 'SUCCESS',
  provider: 'SIMULATED_MODAL',
  idempotencyKey: 'payment-8d2e21c0-3843-44f9-bf13-7562d3d80915-01',
  createdAt: '2026-06-30T13:26:00.000Z',
  order: {
    id: '6d06342a-f98f-4de9-8da9-b425b285b37a',
    reservationId: '8d2e21c0-3843-44f9-bf13-7562d3d80915',
    userId: 'guest-8ff5ad4f-731d-4e8a-81ee-a45817d3c79c',
    totalAmount: '5000000',
    status: 'PAID',
    createdAt: '2026-06-30T13:26:00.000Z',
  },
  serverTime: '2026-06-30T13:26:00.000Z',
};

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Purchase history for the authenticated user.',
    schema: {
      example: [
        {
          paymentId: '0d97cf7d-3e67-4686-8acd-9f75c57887fb',
          orderId: '6d06342a-f98f-4de9-8da9-b425b285b37a',
          reservationId: '8d2e21c0-3843-44f9-bf13-7562d3d80915',
          ticketTypeName: 'VIP',
          quantity: 2,
          totalAmount: '5000000',
          paymentStatus: 'SUCCESS',
          orderStatus: 'PAID',
          reservationStatus: 'PAID',
          customerName: 'Pham Manh Tuong',
          customerEmail: 'tuong@example.com',
          customerPhone: '0901234567',
          paidAt: '2026-06-30T13:26:00.000Z',
          seats: [{ id: '21baf0c6-8bc6-4a59-9f42-7d3d9e64bacc', code: 'VIP-A01', rowLabel: 'A', seatNumber: 1 }],
        },
      ],
    },
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required.' })
  @UseGuards(AuthGuard)
  @Get('history')
  findHistory(@Req() request: AuthenticatedRequest) {
    return this.paymentService.findPurchaseHistory(request.user!.id);
  }

  @ApiCreatedResponse({
    description: 'Simulate a successful payment and convert held seats to sold seats.',
    schema: { example: paymentExample },
  })
  @ApiConflictResponse({ description: 'Reservation expired, cancelled, or already paid.' })
  @ApiNotFoundResponse({ description: 'Reservation not found.' })
  @Post('simulate-success')
  simulateSuccess(@Body() dto: SimulatePaymentDto) {
    return this.paymentService.simulateSuccess(dto);
  }

  @ApiCreatedResponse({
    description: 'Simulate a failed payment without releasing the hold.',
    schema: {
      example: {
        ...paymentExample,
        orderId: null,
        status: 'FAILED',
        order: null,
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Reservation not found.' })
  @Post('simulate-failure')
  simulateFailure(@Body() dto: SimulatePaymentDto) {
    return this.paymentService.simulateFailure(dto);
  }
}
