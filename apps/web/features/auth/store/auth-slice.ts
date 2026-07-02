'use client';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '../../../lib/api-client';
import type { AuthCredentials, AuthResponse, AuthUser, RegisterInput } from '../../../types/auth';
import { clearStoredAuth, persistAuth, readStoredAuth } from './auth-storage';
import type { PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  status: 'idle' | 'loading' | 'authenticated' | 'anonymous';
  error: string | null;
};

export const login = createAsyncThunk('auth/login', async (input: AuthCredentials) => {
  const response = await apiClient.login(input);
  persistAuth(response);
  return response;
});

export const register = createAsyncThunk('auth/register', async (input: RegisterInput) => {
  const response = await apiClient.register(input);
  persistAuth(response);
  return response;
});

export const loadStoredSession = createAsyncThunk('auth/load-stored-session', async () => {
  const stored = readStoredAuth();

  if (!stored.accessToken) {
    return null;
  }

  try {
    const user = await apiClient.getMe(stored.accessToken);
    return {
      accessToken: stored.accessToken,
      expiresIn: 0,
      user,
    } satisfies AuthResponse;
  } catch {
    clearStoredAuth();
    return null;
  }
});

const initialState: AuthState = {
  user: null,
  accessToken: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.status = 'anonymous';
      state.error = null;
      clearStoredAuth();
    },
    setAuth(state, action: PayloadAction<AuthResponse>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.status = 'authenticated';
      state.error = null;
      persistAuth(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadStoredSession.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, applyAuthResponse)
      .addCase(register.fulfilled, applyAuthResponse)
      .addCase(loadStoredSession.fulfilled, (state, action) => {
        if (!action.payload) {
          state.status = 'anonymous';
          return;
        }

        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.status = 'authenticated';
        state.error = null;
      })
      .addCase(login.rejected, applyAuthError)
      .addCase(register.rejected, applyAuthError)
      .addCase(loadStoredSession.rejected, (state) => {
        state.status = 'anonymous';
      });
  },
});

function applyAuthResponse(state: AuthState, action: PayloadAction<AuthResponse>) {
  state.user = action.payload.user;
  state.accessToken = action.payload.accessToken;
  state.status = 'authenticated';
  state.error = null;
}

function applyAuthError(state: AuthState) {
  state.status = 'anonymous';
  state.error = 'Email hoặc mật khẩu không hợp lệ.';
}

export const { logout, setAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;
