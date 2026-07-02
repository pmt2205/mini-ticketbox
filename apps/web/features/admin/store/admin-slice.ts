'use client';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '../../../lib/api-client';
import type {
  AdminActiveReservation,
  AdminConcert,
  AdminPurchase,
  AdminStats,
  AdminTicketDetail,
  AdminUser,
} from '../../../types/ticket';
import type { PayloadAction } from '@reduxjs/toolkit';

export type AdminTab = 'overview' | 'holds' | 'users' | 'buyers' | 'tickets' | 'concert';

type LoadAdminDashboardArgs = {
  token: string;
  isRefresh?: boolean;
};

type AdminDashboardPayload = {
  stats: AdminStats;
  activeReservations: AdminActiveReservation[];
  users: AdminUser[];
  purchases: AdminPurchase[];
  ticketDetails: AdminTicketDetail[];
  concert: AdminConcert;
};

type AdminState = {
  activeTab: AdminTab;
  stats: AdminStats | null;
  activeReservations: AdminActiveReservation[];
  users: AdminUser[];
  purchases: AdminPurchase[];
  ticketDetails: AdminTicketDetail[];
  concert: AdminConcert | null;
  loading: boolean;
  refreshing: boolean;
  cancellingId: string | null;
  error: string | null;
};

const initialState: AdminState = {
  activeTab: 'overview',
  stats: null,
  activeReservations: [],
  users: [],
  purchases: [],
  ticketDetails: [],
  concert: null,
  loading: true,
  refreshing: false,
  cancellingId: null,
  error: null,
};

export const loadAdminDashboard = createAsyncThunk(
  'admin/load-dashboard',
  async ({ token }: LoadAdminDashboardArgs): Promise<AdminDashboardPayload> => {
    const [stats, activeReservations, users, purchases, ticketDetails, concert] = await Promise.all([
      apiClient.getAdminStats(token),
      apiClient.getAdminActiveReservations(token),
      apiClient.getAdminUsers(token),
      apiClient.getAdminPurchases(token),
      apiClient.getAdminTicketDetails(token),
      apiClient.getAdminConcert(token),
    ]);

    return {
      stats,
      activeReservations,
      users,
      purchases,
      ticketDetails,
      concert,
    };
  },
);

export const cancelAdminHold = createAsyncThunk(
  'admin/cancel-hold',
  async ({ id, token }: { id: string; token: string }) => {
    await apiClient.cancelAdminReservation(id, token);
    return id;
  },
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdminTab(state, action: PayloadAction<AdminTab>) {
      state.activeTab = action.payload;
    },
    clearAdminData(state) {
      state.stats = null;
      state.activeReservations = [];
      state.users = [];
      state.purchases = [];
      state.ticketDetails = [];
      state.concert = null;
      state.loading = false;
      state.refreshing = false;
      state.cancellingId = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAdminDashboard.pending, (state, action) => {
        if (action.meta.arg.isRefresh) {
          state.refreshing = true;
        } else {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(loadAdminDashboard.fulfilled, (state, action) => {
        state.stats = action.payload.stats;
        state.activeReservations = action.payload.activeReservations;
        state.users = action.payload.users;
        state.purchases = action.payload.purchases;
        state.ticketDetails = action.payload.ticketDetails;
        state.concert = action.payload.concert;
        state.loading = false;
        state.refreshing = false;
      })
      .addCase(loadAdminDashboard.rejected, (state) => {
        state.loading = false;
        state.refreshing = false;
        state.error = 'Không kết nối được API admin hoặc phiên đăng nhập không hợp lệ.';
      })
      .addCase(cancelAdminHold.pending, (state, action) => {
        state.cancellingId = action.meta.arg.id;
        state.error = null;
      })
      .addCase(cancelAdminHold.fulfilled, (state, action) => {
        state.activeReservations = state.activeReservations.filter(
          (reservation) => reservation.id !== action.payload,
        );
        state.cancellingId = null;
      })
      .addCase(cancelAdminHold.rejected, (state) => {
        state.cancellingId = null;
        state.error = 'Không thể hủy lượt giữ này. Vui lòng thử lại sau.';
      });
  },
});

export const { clearAdminData, setAdminTab } = adminSlice.actions;
export const adminReducer = adminSlice.reducer;
