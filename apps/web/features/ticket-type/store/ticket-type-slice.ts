'use client';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ApiClientError, apiClient } from '../../../lib/api-client';
import type { Reservation, TicketTypeDetail } from '../../../types/ticket';
import type { CustomerForm, HoldSeatsInput } from '../types';
import type { PayloadAction } from '@reduxjs/toolkit';

type TicketTypeState = {
  ticketType: TicketTypeDetail | null;
  selectedSeatIds: string[];
  customerModalOpen: boolean;
  customerForm: CustomerForm;
  loading: boolean;
  holding: boolean;
  errorMessage: string | null;
};

const initialCustomerForm: CustomerForm = {
  name: '',
  email: '',
  phone: '',
};

const initialState: TicketTypeState = {
  ticketType: null,
  selectedSeatIds: [],
  customerModalOpen: false,
  customerForm: initialCustomerForm,
  loading: true,
  holding: false,
  errorMessage: null,
};

export const loadTicketTypeDetail = createAsyncThunk<
  { ticketType: TicketTypeDetail; isRefresh: boolean },
  { ticketTypeId: string; isRefresh?: boolean }
>(
  'ticket-type/load-detail',
  async ({ ticketTypeId, isRefresh = false }) => {
    const ticketType = await apiClient.getTicketType(ticketTypeId);
    return { ticketType, isRefresh };
  },
);

export const holdTicketTypeSeats = createAsyncThunk<
  Reservation,
  HoldSeatsInput,
  { rejectValue: string }
>(
  'ticket-type/hold-seats',
  async ({ ticketTypeId, userId, customer, seatIds }, { rejectWithValue }) => {
    try {
      return await apiClient.createSeatReservation({
        ticketTypeId,
        userId,
        customerName: customer.name.trim(),
        customerEmail: customer.email.trim(),
        customerPhone: customer.phone.trim(),
        seatIds,
      });
    } catch (error) {
      if (error instanceof ApiClientError && error.details.statusCode === 409) {
        return rejectWithValue(
          'Một hoặc nhiều ghế vừa được người khác giữ. Sơ đồ đã được làm mới.',
        );
      }

      return rejectWithValue('Không thể giữ các ghế đã chọn.');
    }
  },
);

const ticketTypeSlice = createSlice({
  name: 'ticket-type',
  initialState,
  reducers: {
    closeCustomerModal(state) {
      state.customerModalOpen = false;
    },
    hydrateCustomerForm(state, action: PayloadAction<Partial<CustomerForm>>) {
      state.customerForm = {
        ...state.customerForm,
        ...action.payload,
      };
    },
    openCustomerModal(state, action: PayloadAction<Partial<CustomerForm> | undefined>) {
      if (!state.ticketType || state.selectedSeatIds.length === 0) {
        return;
      }

      state.customerForm = {
        ...state.customerForm,
        ...(action.payload ?? {}),
      };
      state.customerModalOpen = true;
      state.errorMessage = null;
    },
    resetTicketTypeState() {
      return initialState;
    },
    setTicketTypeError(state, action: PayloadAction<string | null>) {
      state.errorMessage = action.payload;
    },
    toggleSeatSelection(state, action: PayloadAction<string>) {
      const seat = state.ticketType?.seats.find((item) => item.id === action.payload);

      if (!seat || seat.status !== 'AVAILABLE' || state.holding) {
        return;
      }

      if (state.selectedSeatIds.includes(seat.id)) {
        state.selectedSeatIds = state.selectedSeatIds.filter((seatId) => seatId !== seat.id);
        return;
      }

      if (state.selectedSeatIds.length >= 10) {
        return;
      }

      state.selectedSeatIds.push(seat.id);
    },
    updateCustomerField(
      state,
      action: PayloadAction<{ field: keyof CustomerForm; value: string }>,
    ) {
      state.customerForm[action.payload.field] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTicketTypeDetail.pending, (state, action) => {
        if (!action.meta.arg.isRefresh) {
          state.loading = true;
        }
      })
      .addCase(loadTicketTypeDetail.fulfilled, (state, action) => {
        state.ticketType = action.payload.ticketType;
        state.selectedSeatIds = state.selectedSeatIds.filter((seatId) =>
          action.payload.ticketType.seats.some(
            (seat) => seat.id === seatId && seat.status === 'AVAILABLE',
          ),
        );
        state.loading = false;
        state.errorMessage = null;
      })
      .addCase(loadTicketTypeDetail.rejected, (state) => {
        state.loading = false;
        state.errorMessage = 'Không tải được sơ đồ ghế.';
      })
      .addCase(holdTicketTypeSeats.pending, (state) => {
        state.holding = true;
        state.errorMessage = null;
      })
      .addCase(holdTicketTypeSeats.fulfilled, (state) => {
        state.holding = false;
        state.customerModalOpen = false;
      })
      .addCase(holdTicketTypeSeats.rejected, (state, action) => {
        state.holding = false;
        state.errorMessage = action.payload ?? 'Không thể giữ các ghế đã chọn.';
      });
  },
});

export const {
  closeCustomerModal,
  hydrateCustomerForm,
  openCustomerModal,
  resetTicketTypeState,
  setTicketTypeError,
  toggleSeatSelection,
  updateCustomerField,
} = ticketTypeSlice.actions;
export const ticketTypeReducer = ticketTypeSlice.reducer;
