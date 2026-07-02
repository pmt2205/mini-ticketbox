'use client';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '../../../lib/api-client';
import type { PurchaseHistoryItem } from '../../../types/ticket';

type HistoryState = {
  items: PurchaseHistoryItem[];
  loading: boolean;
  refreshing: boolean;
  errorMessage: string | null;
};

const initialState: HistoryState = {
  items: [],
  loading: false,
  refreshing: false,
  errorMessage: null,
};

type LoadPurchaseHistoryArgs = {
  token: string;
  isRefresh?: boolean;
};

export const loadPurchaseHistory = createAsyncThunk<
  { items: PurchaseHistoryItem[]; isRefresh: boolean },
  LoadPurchaseHistoryArgs
>(
  'history/load-purchase-history',
  async ({ token, isRefresh = false }) => {
    const items = await apiClient.getPurchaseHistory(token);
    return { items, isRefresh };
  },
);

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    resetPurchaseHistory() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPurchaseHistory.pending, (state, action) => {
        if (action.meta.arg.isRefresh) {
          state.refreshing = true;
        } else {
          state.loading = true;
        }
      })
      .addCase(loadPurchaseHistory.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.loading = false;
        state.refreshing = false;
        state.errorMessage = null;
      })
      .addCase(loadPurchaseHistory.rejected, (state) => {
        state.loading = false;
        state.refreshing = false;
        state.errorMessage = 'Không tải được lịch sử mua vé.';
      });
  },
});

export const { resetPurchaseHistory } = historySlice.actions;
export const historyReducer = historySlice.reducer;
