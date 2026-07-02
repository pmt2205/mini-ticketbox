'use client';

import type { AuthResponse, AuthUser } from '../../../types/auth';

const storageKey = 'mini-ticketbox-auth';

export type StoredAuth = {
  user: AuthUser | null;
  accessToken: string | null;
};

export function readStoredAuth(): StoredAuth {
  if (typeof window === 'undefined') {
    return { user: null, accessToken: null };
  }

  const rawValue = window.localStorage.getItem(storageKey);
  if (!rawValue) {
    return { user: null, accessToken: null };
  }

  try {
    const parsed = JSON.parse(rawValue) as AuthResponse;
    return {
      user: parsed.user,
      accessToken: parsed.accessToken,
    };
  } catch {
    clearStoredAuth();
    return { user: null, accessToken: null };
  }
}

export function persistAuth(response: AuthResponse) {
  window.localStorage.setItem(storageKey, JSON.stringify(response));
}

export function clearStoredAuth() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(storageKey);
  }
}
