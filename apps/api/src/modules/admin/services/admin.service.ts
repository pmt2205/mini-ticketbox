import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { ReservationService } from '../../reservation/services/reservation.service';
import { AdminActiveReservationResponseDto } from '../dto/admin-active-reservation-response.dto';
import { AdminConcertResponseDto } from '../dto/admin-concert-response.dto';
import { AdminPurchaseResponseDto } from '../dto/admin-purchase-response.dto';
import { AdminStatsResponseDto } from '../dto/admin-stats-response.dto';
import { AdminTicketDetailResponseDto } from '../dto/admin-ticket-detail-response.dto';
import { AdminUserResponseDto } from '../dto/admin-user-response.dto';
import { AdminRepository } from '../repositories/admin.repository';

@Injectable()
export class AdminService {
  constructor(
    private readonly configService: ConfigService,
    private readonly adminRepository: AdminRepository,
    private readonly reservationService: ReservationService,
  ) {}

  async getStats(): Promise<AdminStatsResponseDto> {
    const now = new Date();
    const [ticketTypes, revenue, activeReservationCount] = await Promise.all([
      this.adminRepository.findTicketTypes(),
      this.adminRepository.getPaidRevenue(),
      this.adminRepository.countActiveReservations(now),
    ]);

    const ticketTypeResponses = ticketTypes.map((ticketType) => ({
      id: ticketType.id,
      name: ticketType.name,
      price: ticketType.price.toString(),
      totalQuantity: ticketType.totalQuantity,
      soldQuantity: ticketType.soldQuantity,
      heldQuantity: ticketType.heldQuantity,
      availableQuantity:
        ticketType.totalQuantity - ticketType.soldQuantity - ticketType.heldQuantity,
    }));

    return {
      totalTickets: ticketTypeResponses.reduce((total, ticket) => total + ticket.totalQuantity, 0),
      availableTickets: ticketTypeResponses.reduce(
        (total, ticket) => total + ticket.availableQuantity,
        0,
      ),
      heldTickets: ticketTypeResponses.reduce((total, ticket) => total + ticket.heldQuantity, 0),
      soldTickets: ticketTypeResponses.reduce((total, ticket) => total + ticket.soldQuantity, 0),
      revenue: (revenue._sum.totalAmount ?? 0).toString(),
      activeReservationCount,
      ticketTypes: ticketTypeResponses,
      serverTime: now.toISOString(),
    };
  }

  async getActiveReservations(): Promise<AdminActiveReservationResponseDto[]> {
    const now = new Date();
    const reservations = await this.adminRepository.findActiveReservations(now);

    return reservations.map((reservation) => ({
      id: reservation.id,
      ticketTypeId: reservation.ticketTypeId,
      ticketTypeName: reservation.ticketType.name,
      userId: reservation.userId,
      customerName: reservation.customerName,
      customerEmail: reservation.customerEmail,
      customerPhone: reservation.customerPhone,
      quantity: reservation.quantity,
      expiresAt: reservation.expiresAt.toISOString(),
      createdAt: reservation.createdAt.toISOString(),
      remainingSeconds: Math.max(
        0,
        Math.floor((reservation.expiresAt.getTime() - now.getTime()) / 1000),
      ),
      totalAmount: reservation.ticketType.price.mul(reservation.quantity).toString(),
      seats: reservation.seats.map((seat) => ({
        id: seat.id,
        code: seat.code,
        rowLabel: seat.rowLabel,
        seatNumber: seat.seatNumber,
      })),
    }));
  }

  cancelReservation(id: string) {
    return this.reservationService.cancelHold(id);
  }

  async getUsers(): Promise<AdminUserResponseDto[]> {
    const users = await this.adminRepository.findUsers();

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    }));
  }

  async getPurchases(): Promise<AdminPurchaseResponseDto[]> {
    const purchases = await this.adminRepository.findPaidPurchases();

    return purchases
      .filter((payment) => payment.order)
      .map((payment) => ({
        paymentId: payment.id,
        orderId: payment.order!.id,
        reservationId: payment.reservationId,
        userId: payment.order!.userId,
        customerName: payment.reservation.customerName,
        customerEmail: payment.reservation.customerEmail,
        customerPhone: payment.reservation.customerPhone,
        ticketTypeName: payment.reservation.ticketType.name,
        quantity: payment.reservation.quantity,
        totalAmount: payment.order!.totalAmount.toString(),
        paidAt: payment.createdAt.toISOString(),
        seats: payment.reservation.seats.map((seat) => ({
          id: seat.id,
          code: seat.code,
          rowLabel: seat.rowLabel,
          seatNumber: seat.seatNumber,
        })),
      }));
  }

  async getTicketDetails(): Promise<AdminTicketDetailResponseDto[]> {
    const ticketTypes = await this.adminRepository.findTicketDetails();

    return ticketTypes.map((ticketType) => {
      const availableSeats = ticketType.seats.filter((seat) => seat.status === 'AVAILABLE').length;
      const heldSeats = ticketType.seats.filter((seat) => seat.status === 'HELD').length;
      const soldSeats = ticketType.seats.filter((seat) => seat.status === 'SOLD').length;

      return {
        id: ticketType.id,
        name: ticketType.name,
        price: ticketType.price.toString(),
        totalQuantity: ticketType.totalQuantity,
        soldQuantity: ticketType.soldQuantity,
        heldQuantity: ticketType.heldQuantity,
        availableQuantity:
          ticketType.totalQuantity - ticketType.soldQuantity - ticketType.heldQuantity,
        revenue: ticketType.price.mul(ticketType.soldQuantity).toString(),
        activeReservationCount: ticketType.reservations.length,
        seatStatusCounts: {
          available: availableSeats,
          held: heldSeats,
          sold: soldSeats,
        },
      };
    });
  }

  async getConcert(): Promise<AdminConcertResponseDto> {
    const stats = await this.getStats();

    return {
      name: 'Concert Night 2026',
      venue: 'Mini Ticketbox Arena',
      totalCapacity: stats.totalTickets,
      holdTtlSeconds: this.configService.get<number>('reservation.ttlSeconds', 300),
      status: stats.availableTickets > 0 ? 'ACTIVE' : 'SOLD_OUT',
    };
  }
}
