import type {
  ApiError,
  AdminActiveReservation,
  AdminConcert,
  AdminPurchase,
  AdminStats,
  AdminTicketDetail,
  AdminUser,
  Payment,
  PurchaseHistoryItem,
  Reservation,
  TicketType,
  TicketTypeDetail,
} from '../types/ticket';
import type { AuthResponse, AuthUser, AuthCredentials, RegisterInput } from '../types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

type CreateReservationInput = {
  ticketTypeId: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  quantity: number;
};

type CreateSeatReservationInput = {
  ticketTypeId: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  seatIds: string[];
};

type SimulatePaymentInput = {
  reservationId: string;
  idempotencyKey: string;
};

export class ApiClientError extends Error {
  constructor(readonly details: ApiError) {
    super(details.message);
  }
}

async function request<T>(path: string, init?: RequestInit & { token?: string }): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.token ? { Authorization: `Bearer ${init.token}` } : {}),
      ...init?.headers,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const details = (await response.json().catch(() => ({
      statusCode: response.status,
      code: 'REQUEST_FAILED',
      message: 'Request failed',
    }))) as ApiError;

    throw new ApiClientError(details);
  }

  return (await response.json()) as T;
}

export const apiClient = {
  register(input: RegisterInput) {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  login(input: AuthCredentials) {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  getMe(token: string) {
    return request<AuthUser>('/auth/me', {
      token,
    });
  },

  getTicketTypes() {
    return request<TicketType[]>('/ticket-types');
  },

  getTicketType(id: string) {
    return request<TicketTypeDetail>(`/ticket-types/${id}`);
  },

  createReservation(input: CreateReservationInput) {
    return request<Reservation>('/reservations', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  createSeatReservation(input: CreateSeatReservationInput) {
    return request<Reservation>('/reservations/seats', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  getReservation(id: string) {
    return request<Reservation>(`/reservations/${id}`);
  },

  cancelReservation(id: string) {
    return request<Reservation>(`/reservations/${id}`, {
      method: 'DELETE',
    });
  },

  simulatePaymentSuccess(input: SimulatePaymentInput) {
    return request<Payment>('/payments/simulate-success', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  simulatePaymentFailure(input: SimulatePaymentInput) {
    return request<Payment>('/payments/simulate-failure', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  getPurchaseHistory(token: string) {
    return request<PurchaseHistoryItem[]>('/payments/history', {
      token,
    });
  },

  getAdminStats(token: string) {
    return request<AdminStats>('/admin/stats', {
      token,
    });
  },

  getAdminActiveReservations(token: string) {
    return request<AdminActiveReservation[]>('/admin/active-reservations', {
      token,
    });
  },

  cancelAdminReservation(id: string, token: string) {
    return request<Reservation>(`/admin/reservations/${id}`, {
      method: 'DELETE',
      token,
    });
  },

  getAdminUsers(token: string) {
    return request<AdminUser[]>('/admin/users', {
      token,
    });
  },

  getAdminPurchases(token: string) {
    return request<AdminPurchase[]>('/admin/purchases', {
      token,
    });
  },

  getAdminTicketDetails(token: string) {
    return request<AdminTicketDetail[]>('/admin/ticket-details', {
      token,
    });
  },

  getAdminConcert(token: string) {
    return request<AdminConcert>('/admin/concert', {
      token,
    });
  },
};
