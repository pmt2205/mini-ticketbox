'use client';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '../../../lib/api-client';
import type { TicketType } from '../../../types/ticket';
import type { PayloadAction } from '@reduxjs/toolkit';

type EventState = {
  ticketTypes: TicketType[];
  loading: boolean;
  refreshing: boolean;
  errorMessage: string | null;
};

const initialState: EventState = {
  ticketTypes: [],
  loading: true,
  refreshing: false,
  errorMessage: null,
};

export const loadEventTicketTypes = createAsyncThunk<
  { ticketTypes: TicketType[]; isRefresh: boolean },
  boolean | undefined
>(
  'event/load-ticket-types',
  async (isRefresh = false) => {
    const ticketTypes = await apiClient.getTicketTypes();
    return { ticketTypes, isRefresh };
  },
);

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    applyEventInventory(state, action: PayloadAction<TicketType[]>) {
      state.ticketTypes = action.payload;
      state.loading = false;
      state.refreshing = false;
      state.errorMessage = null;
    },
    resetEventInventory() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadEventTicketTypes.pending, (state, action) => {
        if (action.meta.arg) {
          state.refreshing = true;
        } else {
          state.loading = true;
        }
      })
      .addCase(loadEventTicketTypes.fulfilled, (state, action) => {
        state.ticketTypes = action.payload.ticketTypes;
        state.loading = false;
        state.refreshing = false;
        state.errorMessage = null;
      })
      .addCase(loadEventTicketTypes.rejected, (state) => {
        state.loading = false;
        state.refreshing = false;
        state.errorMessage = 'API không phản hồi.';
      });
  },
});

export const { applyEventInventory, resetEventInventory } = eventSlice.actions;
export const eventReducer = eventSlice.reducer;
