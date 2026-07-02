'use client';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ApiClientError, apiClient } from '../../../lib/api-client';
import type { Reservation, TicketType } from '../../../types/ticket';
import type {
  LoadedReservationPayload,
  PaymentResult,
  SimulatedPaymentArgs,
  SimulatedPaymentPayload,
} from '../types';
import type { PayloadAction } from '@reduxjs/toolkit';

type BookingState = {
  reservation: Reservation | null;
  ticketTypes: TicketType[];
  serverOffsetMs: number;
  loading: boolean;
  cancelling: boolean;
  paying: boolean;
  paymentModalOpen: boolean;
  paymentResult: PaymentResult;
  paymentMessage: string | null;
  errorMessage: string | null;
};

const initialState: BookingState = {
  reservation: null,
  ticketTypes: [],
  serverOffsetMs: 0,
  loading: true,
  cancelling: false,
  paying: false,
  paymentModalOpen: false,
  paymentResult: null,
  paymentMessage: null,
  errorMessage: null,
};

async function loadTicketTypesSafely() {
  try {
    return await apiClient.getTicketTypes();
  } catch (error) {
    console.error('Could not load ticket types', error);
    return [];
  }
}

export const loadBookingReservation = createAsyncThunk(
  'booking/load-reservation',
  async (reservationId: string): Promise<LoadedReservationPayload> => {
    const reservation = await apiClient.getReservation(reservationId);
    const ticketTypes = await loadTicketTypesSafely();

    return { reservation, ticketTypes };
  },
);

export const cancelBookingReservation = createAsyncThunk(
  'booking/cancel-reservation',
  async (reservationId: string) => {
    return apiClient.cancelReservation(reservationId);
  },
);

type SimulatedPaymentRejectPayload = {
  message: string;
  reservation?: Reservation;
  ticketTypes?: TicketType[];
};

export const simulateBookingPayment = createAsyncThunk<
  SimulatedPaymentPayload,
  SimulatedPaymentArgs,
  { rejectValue: SimulatedPaymentRejectPayload }
>(
  'booking/simulate-payment',
  async ({ mode, reservation }, { rejectWithValue }) => {
    const input = {
      reservationId: reservation.id,
      idempotencyKey: `payment-${reservation.id}-${crypto.randomUUID()}`,
    };

    try {
      if (mode === 'success') {
        const payment = await apiClient.simulatePaymentSuccess(input);
        const refreshedReservation = await apiClient.getReservation(reservation.id);
        const ticketTypes = await loadTicketTypesSafely();

        return {
          paymentResult: { mode: 'success', orderId: payment.order?.id ?? payment.id },
          paymentMessage: `Thanh toán thành công. Mã đơn hàng: ${payment.order?.id ?? payment.id}`,
          reservation: refreshedReservation,
          ticketTypes,
        };
      }

      await apiClient.simulatePaymentFailure(input);
      return {
        paymentResult: { mode: 'failure' },
        paymentMessage:
          'Thanh toán thất bại theo lựa chọn test. Ghế vẫn đang được giữ cho tới khi hết giờ.',
      };
    } catch (error) {
      if (
        error instanceof ApiClientError &&
        (error.details.code === 'RESERVATION_EXPIRED' ||
          error.details.code === 'RESERVATION_ALREADY_PAID')
      ) {
        const refreshedReservation = await apiClient.getReservation(reservation.id);
        const ticketTypes = await loadTicketTypesSafely();
        const errorMessage =
          error.details.code === 'RESERVATION_EXPIRED'
            ? 'Lượt giữ chỗ đã hết hạn, không thể thanh toán.'
            : 'Lượt giữ chỗ này đã được thanh toán trước đó.';

        return rejectWithValue({
          message: errorMessage,
          reservation: refreshedReservation,
          ticketTypes,
        });
      }

      return rejectWithValue({ message: 'Không thể xử lý thanh toán giả lập lúc này.' });
    }
  },
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    closePaymentModal(state) {
      state.paymentModalOpen = false;
    },
    openPaymentModal(state) {
      state.paymentModalOpen = true;
      state.paymentResult = null;
    },
    resetBookingState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBookingReservation.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadBookingReservation.fulfilled, applyReservationPayload)
      .addCase(loadBookingReservation.rejected, (state) => {
        state.loading = false;
        state.errorMessage = 'Không tìm thấy lượt giữ chỗ hoặc lượt giữ chỗ đã hết hạn.';
      })
      .addCase(cancelBookingReservation.pending, (state) => {
        state.cancelling = true;
        state.errorMessage = null;
      })
      .addCase(cancelBookingReservation.fulfilled, (state) => {
        state.cancelling = false;
      })
      .addCase(cancelBookingReservation.rejected, (state) => {
        state.cancelling = false;
        state.errorMessage = 'Không thể hủy lượt giữ chỗ lúc này.';
      })
      .addCase(simulateBookingPayment.pending, (state) => {
        state.paying = true;
        state.errorMessage = null;
        state.paymentMessage = null;
        state.paymentResult = null;
      })
      .addCase(simulateBookingPayment.fulfilled, (state, action) => {
        state.paying = false;
        state.paymentResult = action.payload.paymentResult;
        state.paymentMessage = action.payload.paymentMessage;

        if (action.payload.reservation) {
          state.reservation = action.payload.reservation;
          state.serverOffsetMs = new Date(action.payload.reservation.serverTime).getTime() - Date.now();
        }

        if (action.payload.ticketTypes) {
          state.ticketTypes = action.payload.ticketTypes;
        }
      })
      .addCase(simulateBookingPayment.rejected, (state, action) => {
        state.paying = false;
        const rejectedValue = action.payload as
          | { message?: string; reservation?: Reservation; ticketTypes?: TicketType[] }
          | undefined;

        state.errorMessage =
          rejectedValue?.message ?? action.error.message ?? 'Không thể xử lý thanh toán giả lập lúc này.';

        if (rejectedValue?.reservation) {
          state.reservation = rejectedValue.reservation;
          state.serverOffsetMs = new Date(rejectedValue.reservation.serverTime).getTime() - Date.now();
        }

        if (rejectedValue?.ticketTypes) {
          state.ticketTypes = rejectedValue.ticketTypes;
        }
      });
  },
});

function applyReservationPayload(
  state: BookingState,
  action: PayloadAction<LoadedReservationPayload>,
) {
  state.reservation = action.payload.reservation;
  state.ticketTypes = action.payload.ticketTypes;
  state.serverOffsetMs = new Date(action.payload.reservation.serverTime).getTime() - Date.now();
  state.loading = false;
  state.errorMessage = null;
}

export const { closePaymentModal, openPaymentModal, resetBookingState } = bookingSlice.actions;
export const bookingReducer = bookingSlice.reducer;
